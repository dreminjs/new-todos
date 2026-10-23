import { useEffect, useRef, useState, useCallback } from 'react';
import { Device, type types } from 'mediasoup-client';
import { io, Socket } from 'socket.io-client';
import { instance } from '../../../../shared/api/api.instance';

interface RemoteParticipant {
  socketId: string;
  stream: MediaStream;
}

export function useCall(
  callId: string,
  options?: { chatId?: string; workspaceId?: string },
) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<types.Transport | null>(null);
  const recvTransportRef = useRef<types.Transport | null>(null);

  const addRemoteTrack = useCallback((socketId: string, track: MediaStreamTrack) => {
    setRemoteParticipants((prev) => {
      const existing = prev.find((p) => p.socketId === socketId);
      if (existing) {
        existing.stream.addTrack(track);
        return [...prev];
      }
      const stream = new MediaStream([track]);
      return [...prev, { socketId, stream }];
    });
  }, []);

  const removeRemoteParticipant = useCallback((socketId: string) => {
    setRemoteParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
  }, []);

  const consume = useCallback(
    async (producerId: string, socketId: string) => {
      const socket = socketRef.current;
      const device = deviceRef.current;
      const recvTransport = recvTransportRef.current;
      if (!socket || !device || !recvTransport) return;

      const { id, kind, rtpParameters } = await socket.emitWithAck('consume', {
        transportId: recvTransport.id,
        producerId,
        rtpCapabilities: device.rtpCapabilities,
      });

      const consumer = await recvTransport.consume({ id, producerId, kind, rtpParameters });
      await socket.emitWithAck('resume-consumer', { consumerId: consumer.id });

      addRemoteTrack(socketId, consumer.track);
    },
    [addRemoteTrack],
  );

  const chatId = options?.chatId ?? callId;
  const workspaceId = options?.workspaceId ?? '';

  const join = useCallback(async () => {
    if (isConnected || isJoining) return;

    try {
      setIsJoining(true);
      setError(null);

      // Обновляем токен, чтобы сессия была гарантированно валидной перед подключением сокета
      try {
        await instance.get('/token');
      } catch (tokenErr) {
        console.warn('[useCall] Token refresh error:', tokenErr);
      }

      const socket = io("http://localhost:3000", {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });
      socketRef.current = socket;

      await new Promise<void>((resolve, reject) => {
        if (socket.connected) {
          resolve();
          return;
        }
        socket.once('connect', () => {
          console.log('[useCall] Socket connected, id:', socket.id);
          resolve();
        });
        socket.once('connect_error', (err) => {
          console.error('[useCall] Socket connect_error:', err);
          reject(err);
        });
      });

      socket.on('new-producer', ({ producerId, socketId }) => {
        consume(producerId, socketId);
      });

      socket.on('peer-left', ({ socketId }) => {
        removeRemoteParticipant(socketId);
      });

      const { rtpCapabilities } = await socket.emitWithAck('join-room', {
        callId,
        chatId,
        workspaceId,
      });

      const device = new Device();
      await device.load({ routerRtpCapabilities: rtpCapabilities });
      deviceRef.current = device;

      const sendParams = await socket.emitWithAck('create-transport', { direction: 'send' });
      const sendTransport = device.createSendTransport(sendParams);
      sendTransportRef.current = sendTransport;

      sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await socket.emitWithAck('connect-transport', {
            transportId: sendTransport.id,
            dtlsParameters,
          });
          callback();
        } catch (err) {
          errback?.(err as Error);
        }
      });

      sendTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
        try {
          const { id } = await socket.emitWithAck('produce', {
            transportId: sendTransport.id,
            kind,
            rtpParameters,
          });
          callback({ id });
        } catch (err) {
          errback?.(err as Error);
        }
      });

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (mediaErr) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (audioErr) {
          alert('Доступ к микрофону или камере запрещён или устройство не найдено');
          throw new Error('Доступ к микрофону или камере запрещён или устройство не найдено');
        }
      }
      setLocalStream(stream);

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        await sendTransport.produce({ track: videoTrack });
      }

      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        await sendTransport.produce({ track: audioTrack });
      }

      const recvParams = await socket.emitWithAck('create-transport', { direction: 'recv' });
      const recvTransport = device.createRecvTransport(recvParams);
      recvTransportRef.current = recvTransport;

      recvTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await socket.emitWithAck('connect-transport', {
            transportId: recvTransport.id,
            dtlsParameters,
          });
          callback();
        } catch (err) {
          errback?.(err as Error);
        }
      });

      const existingProducers = await socket.emitWithAck('get-producers');
      for (const { producerId, socketId } of existingProducers) {
        await consume(producerId, socketId);
      }

      setIsConnected(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsJoining(false);
    }
  }, [callId, chatId, workspaceId, isConnected, isJoining, consume, removeRemoteParticipant]);

  const leave = useCallback(() => {
    localStream?.getTracks().forEach((track) => track.stop());
    sendTransportRef.current?.close();
    recvTransportRef.current?.close();
    socketRef.current?.disconnect();

    setLocalStream(null);
    setRemoteParticipants([]);
    setIsConnected(false);
    setIsJoining(false);
  }, [localStream]);

  const toggleMic = useCallback(() => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  }, [localStream]);

  useEffect(() => {
    return () => leave();
  }, []);

  return {
    localStream,
    remoteParticipants,
    isConnected,
    isJoining,
    error,
    join,
    leave,
    toggleMic,
    toggleCamera,
  };
}

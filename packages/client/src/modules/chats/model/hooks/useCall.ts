import { useEffect, useRef, useState, useCallback } from 'react';
import { Device, type types } from 'mediasoup-client';
import { io, Socket } from 'socket.io-client';

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

  const join = useCallback(async () => {
    try {
      const socket = io("http://localhost:3000", {
        withCredentials: true,
        transports: ["websocket"],
      });
      socketRef.current = socket;

      socket.on('new-producer', ({ producerId, socketId }) => {
        consume(producerId, socketId);
      });

      socket.on('peer-left', ({ socketId }) => {
        removeRemoteParticipant(socketId);
      });

      const { rtpCapabilities } = await socket.emitWithAck('join-room', {
        callId,
        chatId: options?.chatId ?? callId,
        workspaceId: options?.workspaceId ?? '',
      });

      const device = new Device();
      await device.load({ routerRtpCapabilities: rtpCapabilities });
      deviceRef.current = device;

      const sendParams = await socket.emitWithAck('create-transport', { direction: 'send' });
      const sendTransport = device.createSendTransport(sendParams);
      sendTransportRef.current = sendTransport;

      sendTransport.on('connect', async ({ dtlsParameters }, callback) => {
        await socket.emitWithAck('connect-transport', {
          transportId: sendTransport.id,
          dtlsParameters,
        });
        callback();
      });

      sendTransport.on('produce', async ({ kind, rtpParameters }, callback) => {
        const { id } = await socket.emitWithAck('produce', {
          transportId: sendTransport.id,
          kind,
          rtpParameters,
        });
        callback({ id });
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);

      await sendTransport.produce({ track: stream.getVideoTracks()[0] });
      await sendTransport.produce({ track: stream.getAudioTracks()[0] });

      const recvParams = await socket.emitWithAck('create-transport', { direction: 'recv' });
      const recvTransport = device.createRecvTransport(recvParams);
      recvTransportRef.current = recvTransport;

      recvTransport.on('connect', async ({ dtlsParameters }, callback) => {
        await socket.emitWithAck('connect-transport', {
          transportId: recvTransport.id,
          dtlsParameters,
        });
        callback();
      });

      const existingProducers = await socket.emitWithAck('get-producers');
      for (const { producerId, socketId } of existingProducers) {
        await consume(producerId, socketId);
      }

      setIsConnected(true);
    } catch (err) {
      setError(err as Error);
    }
  }, [callId, consume, removeRemoteParticipant]);

  const leave = useCallback(() => {
    localStream?.getTracks().forEach((track) => track.stop());
    sendTransportRef.current?.close();
    recvTransportRef.current?.close();
    socketRef.current?.disconnect();

    setLocalStream(null);
    setRemoteParticipants([]);
    setIsConnected(false);
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

  return { localStream, remoteParticipants, isConnected, error, join, leave, toggleMic, toggleCamera };
}

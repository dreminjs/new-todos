import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { UseGuards } from "@nestjs/common";
import { RoomsService } from "./rooms.service.js";
import { Server, Socket } from "socket.io";
import { CallsService } from "./calls.service.js";
import { BadRequestError, NotFoundError } from "../../classes/app.error.js";
import {
  DtlsParameters,
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup/types";
import { WsAccessTokenGuard } from "../token/guards/ws-access-token.guard.js";
import { WsAuthMiddleware } from "../token/ws-auth.middleware.js";

@UseGuards(WsAccessTokenGuard)
@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class CallsGateway implements OnGatewayInit {
  constructor(
    private readonly wsAuthMiddleware: WsAuthMiddleware,
    private readonly roomService: RoomsService,
    private readonly callsService: CallsService,
  ) {}

  @WebSocketServer()
  private server: Server;

  afterInit(server: Server) {
    server.use(this.wsAuthMiddleware.use);
  }

  @SubscribeMessage("join-room")
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { callId: string; chatId: string; workspaceId: string },
  ) {
    const userId = client.data.userId;
    const room = await this.roomService.getOrCreateRoom(payload.callId);
    this.roomService.addPeer(payload.callId, client.id, userId);

    const existingCall = await this.callsService.getCallInfo(payload.callId);
    if (!existingCall) {
      await this.callsService.startCall({
        callId: payload.callId,
        chatId: payload.chatId,
        workspaceId: payload.workspaceId,
        initiatorId: userId,
      });
    }
    await this.callsService.addParticipant(payload.callId, userId);

    client.data.callId = payload.callId;
    client.join(payload.callId);

    return { rtpCapabilities: room.router.rtpCapabilities };
  }

  @SubscribeMessage("create-transport")
  async handleCreateTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { direction: "send" | "recv" },
  ) {
    const { callId } = client.data as { callId: string };
    const room = this.roomService.getRoom(callId);
    const peer = this.roomService.getPeer(callId, client.id);

    if (!room || !peer) {
      throw new NotFoundError("No found");
    }

    const transport = await room.router.createWebRtcTransport({
      listenIps: [{ ip: "0.0.0.0", announcedIp: process.env.PUBLIC_IP }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: 1_000_000,
      appData: {
        direction: payload.direction,
      },
    });

    peer.transports.set(transport.id, transport);

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    };
  }

  @SubscribeMessage("connect-transport")
  async handleConnectTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { transportId: string; dtlsParameters: DtlsParameters },
  ) {
    const peer = this.roomService.getPeer(client.data.callId, client.id);
    if (!peer) {
      throw new NotFoundError("Not found");
    }
    const transport = peer.transports.get(payload.transportId);
    if (!transport) {
      throw new NotFoundError("Not found");
    }
    await transport.connect({ dtlsParameters: payload.dtlsParameters });
    return { connected: true };
  }

  @SubscribeMessage("produce")
  async handleProduce(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      transportId: string;
      kind: MediaKind;
      rtpParameters: RtpParameters;
    },
  ) {
    const { callId } = client.data;
    const peer = this.roomService.getPeer(callId, client.id);
    if (!peer) {
      throw new NotFoundError("Not found");
    }
    const transport = peer.transports.get(payload.transportId);
    if (!transport) {
      throw new NotFoundError("Not found");
    }
    const producer = await transport.produce({
      kind: payload.kind,
      rtpParameters: payload.rtpParameters,
    });

    peer.producers.set(producer.id, producer);

    client.to(callId).emit("new-producer", {
      socketId: client.id,
      producerId: producer.id,
    });

    return { id: producer.id };
  }

  @SubscribeMessage("consume")
  async handleConsume(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      transportId: string;
      producerId: string;
      rtpCapabilities: RtpCapabilities;
    },
  ) {
    const { callId } = client.data;
    const room = this.roomService.getRoom(callId);
    const peer = this.roomService.getPeer(callId, client.id);

    if (!peer || !room) {
      throw new NotFoundError("Not found");
    }

    const transport = peer.transports.get(payload.transportId);

    if (!transport) {
      throw new NotFoundError("Not found");
    }

    if (
      !room.router.canConsume({
        producerId: payload.producerId,
        rtpCapabilities: payload.rtpCapabilities,
      })
    ) {
      throw new BadRequestError("Cannot consume this producer");
    }

    const consumer = await transport.consume({
      producerId: payload.producerId,
      rtpCapabilities: payload.rtpCapabilities,
      paused: true,
    });

    peer.consumers.set(consumer.id, consumer);

    return {
      id: consumer.id,
      producerId: payload.producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
    };
  }

  @SubscribeMessage("resume-consumer")
  async handleResumeConsumer(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { consumerId: string },
  ) {
    const peer = this.roomService.getPeer(client.data.callId, client.id);
    if (!peer) {
      throw new NotFoundError("No peer");
    }
    const consumer = peer.consumers.get(payload.consumerId);
    if (!consumer) {
      throw new NotFoundError("No Consumer found ");
    }
    await consumer.resume();
    return { resumed: true };
  }

  @SubscribeMessage("get-producers")
  handleGetProducers(@ConnectedSocket() client: Socket) {
    return this.roomService.getOtherProducers(client.data.callId, client.id);
  }

  handleDisconnect(client: Socket) {
    const { callId } = client.data;
    if (callId) {
      client.to(callId).emit("peer-left", { socketId: client.id });
      this.roomService.removePeer(callId, client.id);
      this.callsService.removeParticipant(callId, client.data.userId);
    }
  }
}

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { ChatMessagesService } from "./chat-messages.service.js";
import { Logger, UseGuards } from "@nestjs/common";
import { WsAccessTokenGuard } from "../../../token/guards/ws-access-token.guard.js";
import { JoinChatRoomDto } from "./dto/chat-messages.types.js";
import { Server, Socket } from "socket.io";
import { WsAuthMiddleware } from "../../../token/ws-auth.middleware.js";
import type { IWsChatMessageDeletedPayload, TExtendedChatMessage } from "types";
import { WorkspaceParticipantService } from "../workspace-participant/workspace-participant.service.js";
@UseGuards(WsAccessTokenGuard)
@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class ChatMessagesGateway {
  constructor(
    private readonly wsAuthMiddleware: WsAuthMiddleware,
    private readonly workspaceParticipantService: WorkspaceParticipantService,
    private readonly chatMessagesService: ChatMessagesService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.use(this.wsAuthMiddleware.use);
  }

  @SubscribeMessage("join-chat-room")
  async handleJoinChatRoom(client: Socket, payload: JoinChatRoomDto) {
    const { id } = payload;
    await this.chatMessagesService.joinChatRoomViaWs(id, client.data.userId);
    client.join(`chat-room:${id}`);
  }

  @SubscribeMessage("chat-messages:recieve")
  async handleMessageRecieveMessage(
    client: Socket,
    payload: TExtendedChatMessage,
  ) {
    await this.workspaceParticipantService.validateParticipantViaWs(
      payload.workspace.id,
      client.data.userId,
    );

    return this.server
      .to(`chat-room:${payload.chatId}`)
      .emit("chat-messages:recieve", payload);
  }

  handleSendMessage(payload: TExtendedChatMessage) {
    return this.server
      .to(`chat-room:${payload.chatId}`)
      .emit("chat-messages:recieve", payload);
  }

  @SubscribeMessage("chat-messages:delete")
  async handleMessageDeletMessage(
    client: Socket,
    payload: IWsChatMessageDeletedPayload,
  ) {
    await this.workspaceParticipantService.validateParticipantViaWs(
      payload.workspaceId,
      client.data.userId,
    );
    return this.server
      .to(`chat-room:${payload.chatId}`)
      .emit("chat-messages:delete", payload);
  }

  handleDeleteMessage(payload: IWsChatMessageDeletedPayload) {
    return this.server
      .to(`chat-room:${payload.chatId}`)
      .emit("chat-messages:delete", payload);
  }

  @SubscribeMessage("chat-messages:edit")
  async handleMessageEditMessage(
    client: Socket,
    payload: TExtendedChatMessage,
  ) {
    await this.workspaceParticipantService.validateParticipantViaWs(
      payload.workspace.id,
      client.data.userId,
    );
    return this.server
      .to(`chat-room:${payload.chatId}`)
      .emit("chat-messages:edit", payload);
  }

  handleEditMessage(payload: TExtendedChatMessage) {
    return this.server
      .to(`chat-room:${payload.chatId}`)
      .emit("chat-messages:edit", payload);
  }
}

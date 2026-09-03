import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { ChatMessagesService } from "./chat-messages.service.js";
import { UseGuards } from "@nestjs/common";
import { WsAccessTokenGuard } from "../../../token/guards/ws-access-token.guard.js";
import { JoinChatRoomDto } from "./dto/chat-messages.types.js";
import { Server, Socket } from "socket.io";
import { WsAuthMiddleware } from "../../../token/ws-auth.middleware.js";
import type { IWsChatMessageDeletedPayload, TExtendedChatMessage } from "types";
import { WorkspaceParticipantService } from "../workspace-participant/workspace-participant.service.js";
import { ChatsService } from "../chats/chats.service.js";
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
    private readonly chatsService: ChatsService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage("join-chat-room")
  async handleJoinChatRoom(client: Socket, payload: JoinChatRoomDto) {
    const { id } = payload;
    const candidateId = client.data.userId;
    const chat = await this.chatsService.findById(id);
    if (!chat) {
      throw new WsException("Chat not found");
    }
    const candidate = await this.workspaceParticipantService.findOne({
      where: {
        workspaceId: chat.workspaceId,
        userId: candidateId,
      },
    });

    if (!candidate) {
      throw new WsException("You are not a participant in this chat");
    }

    client.join(`chat-room:${id}`);
  }

  afterInit(server: Server) {
    server.use(this.wsAuthMiddleware.use);
  }

  @SubscribeMessage("chat-message:recieve")
  handleMessageRecieveMessage(client: Socket, payload: TExtendedChatMessage) {
    return this.server
      .to(`chat-room:${payload.chatId}`)
      .emit("chat-message:recieve", payload);
  }

  handleSendMessage(payload: TExtendedChatMessage) {
    return this.server
      .to(`chat-room:${payload.chatId}`)
      .emit("chat-message:recieve", payload);
  }

  @SubscribeMessage("chat-message:delete")
  handleMessageDeletMessage(
    client: Socket,
    payload: IWsChatMessageDeletedPayload,
  ) {
    return this.server
      .to(`chat-room:${payload.chatId}`)
      .emit("chat-message:delete", payload);
  }

  handleDeleteMessage(payload: IWsChatMessageDeletedPayload) {
    return this.server
      .to(`chat-room:${payload.chatId}`)
      .emit("chat-message:delete", payload);
  }

  @SubscribeMessage("chat-message:edit")
  handleMessageEditMessage(client: Socket, payload: TExtendedChatMessage) {
    return this.server
      .to(`chat-room:${payload.chatId}`)
      .emit("chat-message:edit", payload);
  }

  handleEditMessage(payload: TExtendedChatMessage) {
    return this.server
      .to(`chat-room:${payload.chatId}`)
      .emit("chat-message:edit", payload);
  }
}

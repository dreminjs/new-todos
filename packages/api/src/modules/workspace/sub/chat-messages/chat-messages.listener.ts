import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ChatMessagesGateway } from "./chat-message.gateway.js";
import type { IWsChatMessageDeletedPayload, TExtendedChatMessage } from "types";

@Injectable()
export class ChatMessagesListener {
  constructor(private readonly chatMessagesGateway: ChatMessagesGateway) {}

  @OnEvent("chat-messages.created")
  async handleChatMessageCreated(chatMessage: TExtendedChatMessage) {
    this.chatMessagesGateway.handleSendMessage(chatMessage);
  }

  @OnEvent("chat-messages.updated")
  async handleChatMessageUpdated(chatMessage: TExtendedChatMessage) {
    this.chatMessagesGateway.handleEditMessage(chatMessage);
  }

  @OnEvent("chat-messages.deleted")
  async handleChatMessageDeleted(payload: IWsChatMessageDeletedPayload) {
    this.chatMessagesGateway.handleDeleteMessage(payload);
  }
}

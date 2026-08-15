import { Injectable } from "@nestjs/common";
import { ChatMessagesRepository } from "./chat-messages.repository.js";
import { TExtendedChatMessage } from "types";
import {
  CreateMessageBodyDto,
  TCreateMessageDto,
} from "./dto/chat-messages.types.js";
import { ChatMessagesGateway } from "./chat-message.gateway.js";

@Injectable()
export class ChatMessagesService {
  constructor(
    private readonly chatMessagesRepository: ChatMessagesRepository,
    private readonly chatMessagesGateway: ChatMessagesGateway,
  ) {}

  async createOne(dto: TCreateMessageDto) {
    const { chatId, content, userId } = dto;
    const chatMessage = (await this.chatMessagesRepository.createExtended(
      {
        chat: {
          connect: {
            id: chatId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        content,
      },
      {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    )) as unknown as TExtendedChatMessage;

    this.chatMessagesGateway.handleSendMessage(chatMessage);
    return chatMessage;
  }
}

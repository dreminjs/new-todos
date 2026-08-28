import { Injectable } from "@nestjs/common";
import { ChatMessagesRepository } from "./chat-messages.repository.js";
import { IWsChatMessageDeletedPayload, TExtendedChatMessage } from "types";
import {
  GetChatMessagesQuery,
  TCreateMessageDto,
  TUpdateMessageDto,
} from "./dto/chat-messages.types.js";
import { ChatMessagesGateway } from "./chat-message.gateway.js";
import { buildInfinityScrollResponse } from "../../../../libs/buildInfinityScrollResponse.js";

@Injectable()
export class ChatMessagesService {
  constructor(
    private readonly chatMessagesRepository: ChatMessagesRepository,
    private readonly chatMessagesGateway: ChatMessagesGateway,
  ) {}

  async createOne(dto: TCreateMessageDto) {
    const { chatId, content, userId } = dto;
    const chatMessage = await this.chatMessagesRepository.createExtended({
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
    });

    this.chatMessagesGateway.handleSendMessage(chatMessage);
    return chatMessage;
  }

  async deleteOneById(
    { chatId, chatMessageId }: IWsChatMessageDeletedPayload,
    userId: string,
  ) {
    await this.chatMessagesRepository.deleteByIdForUser(chatMessageId, userId);
    this.chatMessagesGateway.handleDeleteMessage({ chatMessageId, chatId });
  }

  async updateOneById(id: string, dto: TUpdateMessageDto) {
    const { chatId, content, userId } = dto;
    const chatMessage = (await this.chatMessagesRepository.updateExtended(
      { id, userId },
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
    )) as unknown as TExtendedChatMessage;

    this.chatMessagesGateway.handleEditMessage(chatMessage);
    return chatMessage;
  }

  async findManyByChatId(chatId: string, query: GetChatMessagesQuery) {
    const foundMessages = await this.chatMessagesRepository.findAllByChatId(
      chatId,
      {
        take: query.take,
        cursor: query.cursor,
      },
    );
    return buildInfinityScrollResponse(foundMessages, query.take);
  }
}

import { Injectable } from "@nestjs/common";
import { ChatMessagesRepository } from "./chat-messages.repository.js";
import { IWsChatMessageDeletedPayload, TExtendedChatMessage } from "types";
import {
  ChatMessagesPathParams,
  GetChatMessagePathParams,
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
      workspace: {
        connect: {
          id: dto.workspaceId,
        }
      },
      content,
    });

    this.chatMessagesGateway.handleSendMessage(chatMessage);
    return chatMessage;
  }

  async deleteOneById(dto: IWsChatMessageDeletedPayload, userId: string) {
    await this.chatMessagesRepository.deleteByIdForUser(
      dto.chatMessageId,
      userId,
    );
    this.chatMessagesGateway.handleDeleteMessage(dto);
  }

  async updateOne(params: ChatMessagesPathParams, dto: TUpdateMessageDto) {
    const { content, userId } = dto;
    const chatMessage = (await this.chatMessagesRepository.updateExtended(
      {
        chatMessageId: params.chatMessageId,
        workspaceId: params.workspaceId,
        chatId: params.chatId,
        userId,
      },
      {
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

  async findMany(params: GetChatMessagePathParams, query: GetChatMessagesQuery) {
    const foundMessages = await this.chatMessagesRepository.findAll(params, {
      take: query.take,
      cursor: query.cursor,
    });
    return buildInfinityScrollResponse(foundMessages, query.take);
  }
}

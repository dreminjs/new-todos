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
import { ChatsService } from "../chats/chats.service.js";
import { WsException } from "@nestjs/websockets";
import { WorkspaceParticipantService } from "../workspace-participant/workspace-participant.service.js";

@Injectable()
export class ChatMessagesService {
  constructor(
    private readonly chatMessagesRepository: ChatMessagesRepository,
    private readonly chatMessagesGateway: ChatMessagesGateway,
    private readonly chatsService: ChatsService,
    private readonly workspaceParticipantService: WorkspaceParticipantService,
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

      replyTo: dto.replyToId
        ? {
            connect: {
              id: dto.replyToId,
            },
          }
        : undefined,
      workspace: {
        connect: {
          id: dto.workspaceId,
        },
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
        content,
      },
    )) as unknown as TExtendedChatMessage;

    this.chatMessagesGateway.handleEditMessage(chatMessage);
    return chatMessage;
  }

  async findMany(
    params: GetChatMessagePathParams,
    query: GetChatMessagesQuery,
  ) {
    const foundMessages = await this.chatMessagesRepository.findAll(params, {
      take: query.take,
      cursor: query.cursor,
    });
    return buildInfinityScrollResponse(foundMessages, query.take);
  }

  async joinChatRoomViaWs(chatId: string, candidateId: string) {
    const chat = await this.chatsService.findById(chatId);
    if (!chat) {
      throw new WsException("Chat not found");
    }
    await this.workspaceParticipantService.validateParticipantViaWs(
      chat.workspaceId,
      candidateId,
    );
  }
}

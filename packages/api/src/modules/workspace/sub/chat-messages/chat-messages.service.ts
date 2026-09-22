import { Injectable } from "@nestjs/common";
import { ChatMessagesRepository } from "./chat-messages.repository.js";
import { IWsChatMessageDeletedPayload, TExtendedChatMessage } from "types";
import {
  ChatMessagesPathParams,
  GetChatMessagePathParams,
  GetChatMessagesQuery,
  TCreateMessageDto,
  TJoinChatRoomDto,
  TUpdateMessageDto,
} from "./dto/chat-messages.types.js";
import { ChatMessagesGateway } from "./chat-message.gateway.js";
import { buildInfinityScrollResponse } from "../../../../libs/buildInfinityScrollResponse.js";
import { WorkspaceParticipantService } from "../workspace-participant/workspace-participant.service.js";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class ChatMessagesService {
  constructor(
    private readonly chatMessagesRepository: ChatMessagesRepository,
    private readonly chatMessagesGateway: ChatMessagesGateway,
    private readonly workspaceParticipantService: WorkspaceParticipantService,
    private readonly eventEmitter: EventEmitter2,
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

  async updateOne(
    params: ChatMessagesPathParams,
    dto: TUpdateMessageDto,
  ): Promise<TExtendedChatMessage> {
    const { content, userId } = dto;
    const chatMessage = await this.chatMessagesRepository.updateExtended(
      {
        chatMessageId: params.chatMessageId,
        workspaceId: params.workspaceId,
        chatId: params.chatId,
        userId,
      },
      {
        content,
      },
    );

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
}

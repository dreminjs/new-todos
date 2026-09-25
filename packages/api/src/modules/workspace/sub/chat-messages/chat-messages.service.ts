import { Injectable } from "@nestjs/common";
import { ChatMessagesRepository } from "./chat-messages.repository.js";
import { IWsChatMessageDeletedPayload, TExtendedChatMessage } from "types";
import {
  ChatMessagesPathParams,
  GetChatMessagePathParams,
  GetChatMessagesQuery,
  type TCreateMessageDto,
  TUpdateMessageDto,
} from "./dto/chat-messages.types.js";
import { buildInfinityScrollResponse } from "../../../../libs/buildInfinityScrollResponse.js";
import { WorkspaceParticipantService } from "../workspace-participant/workspace-participant.service.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { BadRequestError } from "src/classes/app.error.js";
import { Transactional } from "@nestjs-cls/transactional";

@Injectable()
export class ChatMessagesService {
  constructor(
    private readonly chatMessagesRepository: ChatMessagesRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async createOne(dto: TCreateMessageDto) {
    const { chatId, content, userId } = dto;

    if (dto.replyToId) {
      const replyToMessage =
        await this.chatMessagesRepository.findChatMessageChat(dto.replyToId);
      if (dto.chatId !== replyToMessage?.chatId) {
        throw new BadRequestError("Reply to message must be in the same chat");
      }
    }

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

    this.eventEmitter.emit("chat-messages.created", chatMessage);
    return chatMessage;
  }

  async deleteOneById(dto: IWsChatMessageDeletedPayload, userId: string) {
    await this.chatMessagesRepository.deleteByIdForUser(
      dto.chatMessageId,
      userId,
    );
    this.eventEmitter.emit("chat-messages.deleted", dto);
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

    this.eventEmitter.emit("chat-messages.updated", chatMessage);
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

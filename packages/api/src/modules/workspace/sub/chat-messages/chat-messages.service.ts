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
import { EventEmitter2 } from "@nestjs/event-emitter";
import { BadRequestError } from "../../../../classes/app.error.js";
import { Transactional } from "@nestjs-cls/transactional";

import { S3Service } from "../../../infra/s3/s3.service.js";
import type { UploadedMultipartFile } from "@nestjs/platform-fastify/multipart";
import type { IUploadedFile } from "../../../../interfaces/multipart.js";
import { Attachment } from "#generated/client.js";
import { normalizeFiles } from "./helpers/normalize-files.helper.js";
@Injectable()
export class ChatMessagesService {
  constructor(
    private readonly chatMessagesRepository: ChatMessagesRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly s3Service: S3Service,
  ) {}

  @Transactional()
  async createOne(
    dto: TCreateMessageDto,
    files?: Array<UploadedMultipartFile>,
  ) {
    const { chatId, content, userId } = dto;

    if (dto.replyToId) {
      const replyToMessage =
        await this.chatMessagesRepository.findChatMessageChat(dto.replyToId);
      if (dto.chatId !== replyToMessage?.chatId) {
        throw new BadRequestError("Reply to message must be in the same chat");
      }
    }

    const uploadedFiles = files?.length
      ? await this.s3Service.uploadMultipleFiles(await normalizeFiles(files))
      : [];

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
      attachments: {
        create: uploadedFiles.map((file) => ({
          key: file.key,
          name: file.filename,
          mimetype: file.mimetype,
          size: file.size,
        })),
      },
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

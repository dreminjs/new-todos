import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service.js";
import { Prisma } from "generated/prisma/client.js";
import { extendedChatMessageSchema, TExtendedChatMessage } from "types";
import {
  ChatMessagesPathParams,
  GetChatMessagesQuery,
} from "./dto/chat-messages.types.js";
import { PUBLIC_USER_SELECT } from "../../../user/index.js";

@Injectable()
export class ChatMessagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createExtended(
    data: Prisma.ChatMessageCreateInput,
  ): Promise<TExtendedChatMessage> {
    const chatMessage = await this.prisma.chatMessage.create({
      data,
      include: {
        user: {
          select: PUBLIC_USER_SELECT,
        },
      },
    });

    return extendedChatMessageSchema.parse(chatMessage);
  }

  async findAll(
    params: ChatMessagesPathParams,
    query: GetChatMessagesQuery,
  ): Promise<TExtendedChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      where: { ...params },
      include: {
        user: {
          select: PUBLIC_USER_SELECT,
        },
      },
      take: query.take + 1,
      orderBy: { createdAt: "desc" },
      skip: query.cursor ? 1 : 0,
      ...(query.cursor && {
        cursor: {
          id: query.cursor,
        },
      }),
    }) as unknown as TExtendedChatMessage[];
  }

  async updateOneById(id: string, data: Prisma.ChatMessageUpdateInput) {
    return this.prisma.chatMessage.update({
      where: { id },
      data,
    });
  }

  async updateExtended(
    {
      workspaceId,
      chatMessageId,
      chatId,
    }: ChatMessagesPathParams & { userId: string },
    data: Prisma.ChatMessageUpdateInput,
  ): Promise<TExtendedChatMessage> {
    return this.prisma.chatMessage.update({
      where: { workspaceId, chatId, id: chatMessageId },
      data,
      include: {
        user: {
          select: PUBLIC_USER_SELECT,
        },
      },
    }) as unknown as TExtendedChatMessage;
  }

  async deleteByIdForUser(id: string, userId: string) {
    return this.prisma.chatMessage.delete({
      where: { id, userId },
    });
  }
}

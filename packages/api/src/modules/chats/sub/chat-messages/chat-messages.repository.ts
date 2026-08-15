import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service.js";
import { ChatMessage, Prisma } from "generated/prisma/client.js";

@Injectable()
export class ChatMessagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createExtended(
    data: Prisma.ChatMessageCreateInput,
    include?: Prisma.ChatMessageInclude,
  ) {
    return this.prisma.chatMessage.create({
      data,
      include: {
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
    });
  }

  async findAllByChatId({
    chatId,
    include,
    take,
    cursor,
  }: {
    chatId: string;
    include?: Prisma.ChatMessageInclude;
    take?: number;
    cursor?: Prisma.ChatMessageWhereUniqueInput;
  }): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      where: { chatId },
      include,
      take,
      cursor,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor.id,
        },
      }),
    });
  }

  async updateOneById(id: string, data: Prisma.ChatMessageUpdateInput) {
    return this.prisma.chatMessage.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.chatMessage.delete({
      where: { id },
    });
  }
}

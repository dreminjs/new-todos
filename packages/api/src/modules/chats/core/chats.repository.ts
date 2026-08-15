import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Chat, Prisma } from "generated/prisma/client.js";

@Injectable()
export class ChatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByWorkspaceId(workspaceId: string): Promise<Chat[]> {
    return this.prisma.chat.findMany({
      where: {
        workspaceId,
      },
    });
  }

  async findById(id: string): Promise<Chat | null> {
    return this.prisma.chat.findFirst({
      where: {
        id,
      },
    });
  }

  async create(data: Prisma.ChatCreateInput): Promise<Chat> {
    return this.prisma.chat.create({ data });
  }

  async update(id: string, data: Prisma.ChatUpdateInput): Promise<Chat> {
    return this.prisma.chat.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Chat> {
    return this.prisma.chat.delete({ where: { id } });
  }
}

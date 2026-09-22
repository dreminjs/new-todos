import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service.js";
import { Chat, Prisma } from "generated/prisma/client.js";
import { FindWorkspaceChatsPathParams } from "./dto/chats.types.js";

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

  async findOneById(id: string): Promise<Chat | null> {
    return this.prisma.chat.findFirst({
      where: {
        id,
      },
    });
  }

  async findOneByIdAndWorkspaceId(dto: FindWorkspaceChatsPathParams) {
    return this.prisma.chat.findFirst({
      where: {
        id: dto.id,
        workspaceId: dto.workspaceId,
      },
    });
  }

  async create(data: Prisma.ChatCreateInput): Promise<Chat> {
    return this.prisma.chat.create({ data });
  }

  async update(
    { workspaceId, id }: { id: string; workspaceId: string },
    data: Prisma.ChatUpdateInput,
  ): Promise<Chat> {
    return this.prisma.chat.update({ where: { id }, data });
  }

  async delete({
    id,
    workspaceId,
  }: {
    id: string;
    workspaceId: string;
  }): Promise<Chat> {
    return this.prisma.chat.delete({ where: { id, workspaceId } });
  }
}

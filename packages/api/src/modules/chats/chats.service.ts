import { Injectable } from "@nestjs/common";
import { Chat, Prisma } from "generated/prisma/client.js";
import { ChatsRepository } from "./chats.repository.js";
import { CreateChatDto, UpdateChatDto } from "./dto/chats.types.js";

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async findAllByWorkspaceId(workspaceId: string): Promise<Chat[]> {
    return this.chatsRepository.findAllByWorkspaceId(workspaceId);
  }

  async findById(id: string): Promise<Chat | null> {
    return this.chatsRepository.findById(id);
  }

  async create(data: CreateChatDto): Promise<Chat> {
    return this.chatsRepository.create({
      ...data,
      workspace: {
        connect: { id: data.workspaceId },
      },
    });
  }

  async update(id: string, data: UpdateChatDto): Promise<Chat> {
    return this.chatsRepository.update(id, data);
  }

  async delete(id: string): Promise<Chat> {
    return this.chatsRepository.delete(id);
  }

  async findChatsByWorkspaceId(workspaceId: string): Promise<Chat[]> {
    return this.chatsRepository.findAllByWorkspaceId(workspaceId);
  }
}

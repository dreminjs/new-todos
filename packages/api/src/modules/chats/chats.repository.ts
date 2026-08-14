import { Injectable } from '@nestjs/common';
import { Chat, PrismaClient } from 'generated/prisma/client.js';

@Injectable()
export class ChatsRepository {
  constructor(private readonly prisma: PrismaClient) {

  }

  async findAll(): Promise<Chat[]> {
    return this.prisma.chat.findMany();
  }

  async findById(id: string): Promise<Chat | null> {
    return this.prisma.chat.findUnique({ where: { id } });
  }

}

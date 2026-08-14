import { Module } from "@nestjs/common";
import { ChatsService } from "./chats.service.js";
import { ChatsController } from "./chats.controller.js";
import { ChatsRepository } from "./chats.repository.js";
import { PrismaModule } from "../prisma/prisma.module.js";

@Module({
  imports: [PrismaModule],
  providers: [ChatsService, ChatsRepository],
  controllers: [ChatsController],
})
export class ChatsModule {}

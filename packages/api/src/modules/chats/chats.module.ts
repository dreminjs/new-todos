import { Module } from "@nestjs/common";
import { ChatsService } from "./chats.service.js";
import { ChatsController } from "./chats.controller.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { ChatsRepository } from "./chats.repository.js";

@Module({
  imports: [PrismaModule],
  providers: [ChatsService, ChatsRepository],
  controllers: [ChatsController],
  exports: [ChatsService],
})
export class ChatsModule {}

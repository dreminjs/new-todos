import { Module } from "@nestjs/common";
import { PrismaModule } from "../../../prisma/prisma.module.js";
import { ChatMessagesController } from "./chat-messages.controller.js";
import { ChatMessagesService } from "./chat-messages.service.js";
import { ChatMessagesRepository } from "./chat-messages.repository.js";
import { TokenModule } from "../../../token/token.module.js";

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService, ChatMessagesRepository],
  exports: [ChatMessagesService],
})
export class ChatMessagesModule {}

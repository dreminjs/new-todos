import { Module } from "@nestjs/common";
import { ChatsService } from "./chats.service.js";
import { PrismaModule } from "../../../prisma/prisma.module.js";
import { ChatsRepository } from "./chats.repository.js";
import { ChatsController } from "./chats.controller.js";
import { WorkspaceParticipantModule } from "../workspace-participant/workspace-participant.module.js";

@Module({
  imports: [PrismaModule, WorkspaceParticipantModule],
  providers: [ChatsService, ChatsRepository],
  controllers: [ChatsController],
  exports: [ChatsService],
})
export class ChatsModule {}

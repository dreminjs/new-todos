import { forwardRef, Module } from "@nestjs/common";
import { PrismaModule } from "../../../prisma/prisma.module.js";
import { ChatMessagesController } from "./chat-messages.controller.js";
import { ChatMessagesService } from "./chat-messages.service.js";
import { ChatMessagesRepository } from "./chat-messages.repository.js";
import { TokenModule } from "../../../token/token.module.js";
import { ChatMessagesGateway } from "./chat-message.gateway.js";
import { UserModule } from "../../../user/user.module.js";
import { WorkspaceParticipantModule } from "../workspace-participant/workspace-participant.module.js";
import { ChatsModule } from "../chats/chats.module.js";

@Module({
  imports: [
    PrismaModule,
    TokenModule,
    UserModule,
    WorkspaceParticipantModule,
    forwardRef(() => ChatsModule),
  ],
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService, ChatMessagesRepository, ChatMessagesGateway],
  exports: [ChatMessagesService],
})
export class ChatMessagesModule {}

import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { NotifactionsGateway } from "./notifactions.gateway.js";
import { UserModule } from "../user/user.module.js";
import { TokenModule } from "../token/token.module.js";
import { NotificationsRepository } from "./notifications.repository.js";
import { NotificationsController } from "./notifications.controller.js";
import { NotificationCleanupListener } from "./listeners/notification-cleanup.listener.js";
import { NotificationCreateListener } from "./listeners/notification-create.listener.js";

@Module({
  imports: [PrismaModule, UserModule, TokenModule],
  providers: [
    NotificationsService,
    NotifactionsGateway,
    NotificationsRepository,
    NotificationCleanupListener,
    NotificationCreateListener,
  ],
  controllers: [NotificationsController],
  exports: [NotificationsService, NotifactionsGateway],
})
export class NotificationsModule {}

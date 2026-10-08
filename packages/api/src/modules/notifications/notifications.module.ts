import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { UserModule } from "../user/user.module.js";
import { TokenModule } from "../token/token.module.js";
import { NotificationsRepository } from "./notifications.repository.js";
import { NotificationsController } from "./notifications.controller.js";
import { NotificationCleanupListener } from "./listeners/notification-cleanup.listener.js";
import { NotificationCreateListener } from "./listeners/notification-create.listener.js";
import { WsSessionModule } from "../infra/ws-session/ws-session.module.js";
import { NotificationsGateway } from "./notifactions.gateway.js";
import { RedisClientModule } from "../infra/redis/redis.module.js";

@Module({
  imports: [
    PrismaModule,
    UserModule,
    TokenModule,
    WsSessionModule,
    RedisClientModule,
  ],
  providers: [
    NotificationsService,
    NotificationsGateway,
    NotificationsRepository,
    NotificationCleanupListener,
    NotificationCreateListener,
  ],
  controllers: [NotificationsController],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}

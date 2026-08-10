import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { notificationEventCleanupSchema } from "../dto/notifications.schema.js";
import { NotificationsService } from "../notifications.service.js";
import type { TNotificationEventCleanup } from "../dto/notifactions.dto.js";


@Injectable()
export class NotificationCleanupListener {
  private readonly logger = new Logger(NotificationCleanupListener.name);
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent("notification.cleanup", { async: true })
  async handleNotificationCleanup(dto: TNotificationEventCleanup) {
    const result = notificationEventCleanupSchema.safeParse(dto);

    if (!result.success) {
      this.logger.error(
        "in correct value on event notification.cleanup",
        result.error,
      );
      return;
    }

    try {
      await this.notificationsService.deleteManyByIds(result.data.ids);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

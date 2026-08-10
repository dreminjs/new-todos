import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { NotificationsService } from "../notifications.service.js";
import { SendCreateNotification } from "../dto/notifactions.dto.js";

@Injectable()
export class NotificationCreateListener {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private logger = new Logger(NotificationCreateListener.name);

  @OnEvent("notifications.create")
  async handleNotificationCreate(dto: SendCreateNotification) {
    try {
      await this.notificationsService.createOne(dto);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

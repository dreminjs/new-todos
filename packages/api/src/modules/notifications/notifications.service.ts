import { Injectable } from "@nestjs/common";
import { TCreateNotification, notifactionSchema } from "types";
import { NotificationsRepository } from "./notifications.repository.js";
import { NotifactionsGateway } from "./notifactions.gateway.js";
import { GetNotificationsQuery } from "./dto/notifactions.dto.js";
import { buildInfinityScrollResponse } from "../../libs/buildInfinityScrollResponse.js";
import type { IItemsResponse, TNotification } from "types";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notifactionsGateway: NotifactionsGateway,
  ) {}

  async createOne(data: TCreateNotification): Promise<TNotification> {
    const notification = await this.notificationsRepository.create(data);

    await this.notifactionsGateway.sendNotifitacation(
      data.userId,
      notification,
    );

    return notifactionSchema.parse(notification);
  }

  async deleteManyByIds(ids: string[]): Promise<void> {
    await this.notificationsRepository.deleteManyByIds(ids);
  }

  async readOneById(id: string) {
    return await this.notificationsRepository.updateOneById(id, { read: true });
  }

  async unreadOneById(id: string) {
    return await this.notificationsRepository.updateOneById(id, {
      read: false,
    });
  }

  async findMy(
    currentUserId: string,
    query: GetNotificationsQuery,
  ): Promise<IItemsResponse<TNotification>> {
    const foundNotifications =
      await this.notificationsRepository.findAllByUserId(currentUserId, {
        cursor: query.cursor ? { id: query.cursor } : undefined,
        take: query.take + 1,
        skip: query.cursor ? 1 : 0,
        orderBy: [
          {
            read: "asc",
          },
        ],
      });
    return buildInfinityScrollResponse(foundNotifications, query.take);
  }
}

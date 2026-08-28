import { Injectable, Logger } from "@nestjs/common";
import { TCreateNotification } from "types";
import { PrismaService } from "../prisma/prisma.service.js";
import { Notification, Prisma } from "generated/prisma/client.js";
import { NotificationFindManyArgs } from "generated/prisma/models.js";

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: TCreateNotification) {
    return this.prisma.notification.create({
      data: {
        message: data.message,
        userId: data.userId,
        workspaceInvitationId: data.workspaceInvitationId,
        workspaceRequestId: data.workspaceRequestId,
      },
    });
  }

  async deleteManyByIds(ids: string[]): Promise<void> {
    await this.prisma.notification.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async findAllByUserId(
    userId: string,
    args?: NotificationFindManyArgs,
  ): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      ...args,
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
      },
    });
  }

  async deleteOneById(id: string) {
    await this.prisma.notification.delete({ where: { id } });
  }

  async updateOneByIdForUser(
    { id, userId }: { id: string; userId: string },
    dto: Prisma.NotificationUpdateInput,
  ) {
    return await this.prisma.notification.update({
      where: { id, userId },
      data: dto,
    });
  }
}

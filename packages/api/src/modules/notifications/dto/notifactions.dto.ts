import { infinityQueryParamsSchema, TCreateNotification, TNotification } from "types";
import { notificationEventCleanupSchema } from "./notifications.schema.js";
import z from "zod";
import { createZodDto } from "nestjs-zod";

export type TCreateNotificationDto = Pick<TNotification, "userId" | "message">;
export type TNotificationEventCleanup = z.infer<
  typeof notificationEventCleanupSchema
>;

export type TDeleteParamsNotitifacation = Pick<
  TCreateNotification,
  "workspaceInvitationId" | "workspaceRequestId"
> & {
  notificationId: string | null;
};

export class SendCreateNotification implements TCreateNotification {
  constructor(dto: TCreateNotification) {
    this.message = dto.message;
    this.userId = dto.userId;
    this.workspaceId = dto.workspaceId;
    this.workspaceInvitationId = dto.workspaceInvitationId;
    this.workspaceRequestId = dto.workspaceRequestId;
  }

  message: string;
  userId: string;
  workspaceId: string | null;
  workspaceInvitationId: string | null;
  workspaceRequestId: string | null;
}

export class GetNotificationsQuery extends createZodDto(infinityQueryParamsSchema) {}

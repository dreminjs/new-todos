import { z } from "zod";

export const notificationType = z.enum(["CHAT_MESSAGE", "WORKSPACE_INVITE"]);

export const createNotificationSchema = z.object({
  message: z.string(),
  userId: z.string(),
  workspaceRequestId: z.string().nullable(),
  workspaceInvitationId: z.string().nullable(),
});

export const notifactionSchema = createNotificationSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  read: z.boolean(),
});

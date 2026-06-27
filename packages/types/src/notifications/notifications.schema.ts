import { z } from "zod";

export const createNotificationSchema = z.object({
  message: z.string(),
  userId: z.string(),
});

export const notifactionSchema = createNotificationSchema.extend({
  id: z.string(),
  read: z.enum(["true", "false"]).transform((val) => val === "true"),
  createdAt: z.string().datetime(),
});

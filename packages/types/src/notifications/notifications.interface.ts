import * as z from "zod";
import {
  createNotificationSchema,
  notifactionSchema,
  notificationType,
} from "./notifications.schema.js";

export type TNotification = z.infer<typeof notifactionSchema>;
export type TCreateNotification = z.infer<typeof createNotificationSchema>;
export type TNotificationType = z.infer<typeof notificationType>;

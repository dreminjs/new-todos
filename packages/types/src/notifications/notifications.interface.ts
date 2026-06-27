import * as z from "zod";
import {
  createNotificationSchema,
  notifactionSchema,
} from "./notifications.schema.js";

export type TNotification = z.infer<typeof notifactionSchema>;
export type TCreateNotification = z.infer<typeof createNotificationSchema>;

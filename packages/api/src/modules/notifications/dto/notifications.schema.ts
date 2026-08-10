
import { z } from "zod";

export const notificationEventCleanupSchema = z.object({
  ids: z.array(z.string()).min(1)
});

import * as z from "zod";

export const infinityQueryParamsSchema = z.object({
  cursor: z.string().optional(),
  take: z.coerce.number().int().min(1).max(100).default(10),
});

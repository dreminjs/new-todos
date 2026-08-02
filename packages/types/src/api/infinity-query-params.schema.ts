
import * as z from "zod"

export const infinityQueryParamsSchema = z.object({
  cursor: z.string(),
  take: z.number()
})

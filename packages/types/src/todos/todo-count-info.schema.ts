import * as z from "zod";

export const todoCountInfoSchema = z.object({
  countAllTodos: z.number(),
  countOfCompletedTodos: z.number(),
});

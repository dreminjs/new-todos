import * as z from "zod";

export const createTodoGroupSchema = z.object({
  name: z.string(),
});

export const todoGroupSchema = z.object({
  name: z.string(),
  id: z.string(),
  userId: z.string(),
});

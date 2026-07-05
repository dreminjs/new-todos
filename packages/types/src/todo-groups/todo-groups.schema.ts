import * as z from "zod";

export const createTodoGroupSchema = z.object({
  name: z.string().min(1).max(50),
});

export const todoGroupSchema = createTodoGroupSchema.extend({
  id: z.string(),
  userId: z.string(),
});

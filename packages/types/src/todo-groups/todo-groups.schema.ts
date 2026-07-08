import * as z from "zod";

export const createTodoGroupSchema = z.object({
  name: z.string().min(1).max(50),
  id: z.string(),
  userId: z.string(),
});
export const updateTodoGroupSchema = createTodoGroupSchema.pick({
  name: true,
});

export const todoGroupSchema = createTodoGroupSchema;

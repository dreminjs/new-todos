import { todoSchema } from "types";
import { z } from "zod";

export const todoFormSchema = todoSchema
  .extend({
    deadline: z.date().nullable().optional(),
    userId: z.string().uuid().optional(),
  })
  .omit({
    completed: true,
    isMyToday: true,
    createdAt: true,
    id: true,
    todoGroupId: true,
    workspaceId: true,
  });

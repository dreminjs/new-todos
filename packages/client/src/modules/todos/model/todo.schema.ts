import { prioritySchema, todoSchema } from "types";
import { z } from "zod";

export const todoFormSchema = todoSchema
  .extend({
    deadline: z.date().nullable().optional(),
    userId: z.string().uuid().optional(),
    priority: prioritySchema.optional().nullable(),
  })
  .omit({
    createdAt: true,
    id: true,
    todoGroupId: true,
    workspaceId: true,
    updatedAt: true,
  });

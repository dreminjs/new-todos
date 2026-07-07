import * as z from "zod";
import { workspaceSchema } from "../workspace/workspace.schema.js";
import { todoGroupSchema } from "../todo-groups/todo-groups.schema.js";

export const statusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

const date = z.coerce.date();
export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string(),
  priority: prioritySchema.optional().nullable(),
  status: statusSchema.nullable(),
  isMyToday: z.boolean(),
  createdAt: date,
  updatedAt: date,
  userId: z.string().uuid(),
  workspaceId: z.string().uuid().nullable().optional(),
  todoGroupId: z.string().uuid().nullable().optional(),
  deadline: date.nullable().optional(),
});

export const extendedTodoSchema = todoSchema
  .omit({
    workspaceId: true,
    todoGroupId: true,
  })
  .extend({
    workspace: workspaceSchema.nullable(),
    todoGroup: todoGroupSchema.nullable(),
  });

export const findTodosSchema = z.object({
  deadline: date.optional(),
  workspaceId: z.string().optional(),
  assignedUserId: z.string().optional(),
  priority: prioritySchema.optional(),
  status: statusSchema.optional(),
  todoGroupId: z.string().uuid().optional(),
  planned: z.coerce.boolean().optional(),
  assignedMe: z.coerce.boolean().optional(),
  isMyToday: z.coerce.boolean().optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number(),
});

export const updateTodoStatusSchema = z.object({
  status: statusSchema,
});

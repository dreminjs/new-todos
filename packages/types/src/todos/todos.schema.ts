import * as z from "zod";

export const statusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const boolean = z.coerce.boolean();

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional(),
  priority: prioritySchema.optional(),
  status: statusSchema.nullable(),
  completed: boolean.default(false),
  isMyToday: boolean.optional(),
  createdAt: date,
  userId: z.string().uuid(),
  workspaceId: z.string().uuid().optional(),
  todoGroupId: z.string().uuid().optional(),
  deadline: date.optional(),
});

export const findTodosSchema = z.object({
  deadline: date.optional(),
  workspaceId: z.string().optional(),
  assignedUserId: z.string().optional(),
  priority: prioritySchema.optional(),
  status: statusSchema,
  todoGroupId: z.string().uuid().optional(),
  planned: boolean.optional(),
  assignedMe: boolean.optional(),
  isMyToday: boolean.optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number(),
});

export const updateTodoStatusSchema = z.object({
  status: statusSchema,
});

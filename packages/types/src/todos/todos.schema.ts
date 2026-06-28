import * as z from "zod";

export const statusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().nullable(),
  priority: prioritySchema.optional(),
  status: statusSchema,
  completed: z.boolean().default(false),
  isMyToday: z.coerce.boolean().optional(),
  createdAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  userId: z.string().uuid(),
  workspaceId: z.string().uuid().optional(),
  todoGroupId: z.string().uuid().optional(),
});

export const findTodosSchema = z.object({
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  workspaceId: z.string().optional(),
  assignedUserId: z.string().optional(),
  priority: prioritySchema.optional(),
  status: statusSchema,
  planned: z.coerce.boolean().optional(),
  assignedMe: z.coerce.boolean().optional(),
  isMyToday: z.coerce.boolean().optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number(),
});

export const updateTodoStatusSchema = z.object({
  status: statusSchema,
});

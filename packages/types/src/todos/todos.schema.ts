import * as z from "zod";
import { workspaceSchema } from "../workspace/workspace.schema.js";
import { todoGroupSchema } from "../todo-groups/todo-groups.schema.js";
import { boolean } from "../shared/schema.js";
import { userSchema } from "../user/user.schema.js";

export const statusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const todoParticipantSchema = z.object({
  id: z.string().uuid(),
  todoId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const extendedTodoParticipantSchema = todoParticipantSchema
  .omit({
    userId: true,
  })
  .extend({
    user: userSchema,
  });

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string(),
  priority: prioritySchema.optional().nullable(),
  status: statusSchema.nullable(),
  isMyToday: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  workspaceId: z.string().uuid().nullable().optional(),
  todoGroupId: z.string().uuid().nullable().optional(),
  deadline: z.date().nullable().optional(),
});

export const extendedTodoSchema = todoSchema
  .omit({
    workspaceId: true,
    todoGroupId: true,
  })
  .extend({
    workspace: workspaceSchema.nullable(),
    todoGroup: todoGroupSchema.nullable(),
    todoParticipants: extendedTodoParticipantSchema.array(),
  });

export const findTodosSchema = z.object({
  deadline: z.string().datetime().nullable().optional(),
  workspaceId: z.string().optional(),
  assignedUserId: z.string().optional(),
  priority: prioritySchema.optional(),
  status: statusSchema.optional(),
  todoGroupId: z.string().uuid().optional(),
  planned: boolean,
  assignedMe: boolean,
  isMyToday: boolean.optional(),
  cursor: z.string().uuid().optional(),
  limit: z.string().transform((v) => Number(v)),
});

export const updateTodoStatusSchema = z.object({
  status: statusSchema,
});

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

export const todoSchema = z.object({
  id: z.uuid(),
  title: z.string().min(2),
  description: z.string(),
  priority: prioritySchema.optional().nullable(),
  status: statusSchema.optional(),
  isMyToday: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  workspaceId: z.uuid().nullable().optional(),
  todoGroupId: z.uuid().nullable().optional(),
  deadline: z.date().nullable().optional(),
  assigneeId: z.string().nullable().optional(),
});

export const extendedTodoSchema = todoSchema
  .omit({
    workspaceId: true,
    todoGroupId: true,
    assigneeId: true
  })
  .extend({
    workspace: workspaceSchema.nullable(),
    todoGroup: todoGroupSchema.nullable(),
    user: userSchema.nullable(),
    assignee: userSchema.nullable(),
  });

export const findTodosSchema = z.object({
  deadline: z.string().datetime().optional(),
  workspaceId: z.uuid().optional(),
  assignedUserId: z.uuid().optional(),
  priority: prioritySchema.optional(),
  status: statusSchema.optional(),
  todoGroupId: z.uuid().optional(),
  planned: boolean.optional(),
  cursor: z.string().uuid().optional(),
  limit: z.string().transform((v) => Number(v)),
});

export const updateTodoStatusBodySchema = z.object({
  status: statusSchema,
  workspaceId: z.uuid().optional(),
  todoGroupId: z.uuid().optional(),
});

export const joinGroupTodosRoomSchema = z.object({
  todoGroupId: z.uuid(),
  workspaceId: z.uuid(),
});

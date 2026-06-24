import * as z from "zod";

export const createTodoSchema = z.object({
  title: z.string(),
  description: z.string(),
  deadline: z.date().nullable(),
  workspaceId: z.string().nullable(),
  assignedUserId: z.string().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const findTodosSchema = z.object({
  deadline: z.date().nullable(),
  workspaceId: z.string().nullable(),
  assignedUserId: z.string().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  planned: z.date().nullable(),
  assignedMe: z.boolean().nullable(),
});

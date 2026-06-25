import * as z from "zod";

export const createTodoSchema = z.object({
  title: z.string(),
  description: z.string(),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  workspaceId: z.string().nullable(),
  assignedUserId: z.string().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const findTodosSchema = z.object({
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  workspaceId: z.string().nullable(),
  assignedUserId: z.string().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  planned: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
  assignedMe: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});

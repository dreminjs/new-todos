import * as z from "zod";

export const createTodoGroupSchema = z.object({
  name: z.string().min(1).max(50),
  id: z.uuid(),
  userId: z.uuid(),
  workspaceId: z.string().nullable().optional(),
});
export const updateTodoGroupSchema = createTodoGroupSchema.pick({
  name: true,
});

export const todoGroupSchema = createTodoGroupSchema;

export const todoGroupResponseSchema = todoGroupSchema.extend({
  hasAccess: z.boolean(),
})

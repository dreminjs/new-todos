import * as z from "zod";

export const createTodoGroupBodySchema = z.object({
  name: z.string().min(1).max(50),

  workspaceId: z.string().nullable().optional(),
});
export const updateTodoGroupBodySchema = createTodoGroupBodySchema.pick({
  name: true,
});

export const todoGroupSchema = createTodoGroupBodySchema.extend({
  id: z.uuid()
})

export const todoGroupResponseSchema = todoGroupSchema.extend({
  hasAccess: z.boolean(),
});

export const findTodoGroupsSchema = z.object({
  workspaceId: z.string().nullable().optional(),
});

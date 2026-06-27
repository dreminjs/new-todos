import * as z from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string(),
});

export const workspaceSchema = createWorkspaceSchema.extend({
  id: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
});

export const joinWorkspaceSchema = z.object({
  workspaceId: z.string(),
});

export const createWorkspaceInvitationSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
});

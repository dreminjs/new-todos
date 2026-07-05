import * as z from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string(),
});

export const workspaceSchema = createWorkspaceSchema.extend({
  id: z.string(),
  ownerId: z.string(),
});

export const createWorkspaceRequestSchema = z.object({
  workspaceId: z.string(),
});

export const createWorkspaceInvitationSchema = z.object({
  workspaceId: z.string(),
  email: z.email(),
});

export const createWorkspaceParticipantSchema =
  createWorkspaceInvitationSchema.extend({
    roleId: z.string().optional(),
  });

export const workspaceInvitationSchema = z.object({
  id: z.string(),

  workspaceId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
});

export const extendedWorkspaceInvitationSchema = workspaceInvitationSchema
  .omit({
    userId: true,
    workspaceId: true,
  })
  .extend({
    workspace: z.object({
      id: z.string(),
      name: z.string(),
    }),
    user: z.object({
      firstName: z.string(),
      lastName: z.string(),
      id: z.string(),
    }),
  });

export const workspaceRequestSchema = createWorkspaceRequestSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.date(),
});

export const membershipResultSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  isOwner: z.boolean(),
});

export const actionWorkspaceInvitationSchema = z.object({
  invitationId: z.string(),
});

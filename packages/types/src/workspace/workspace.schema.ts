import * as z from "zod";
import { todoCountInfoSchema } from "../todos/todo-count-info.schema.js";
export const workspaceRoles = z.enum(["OWNER", "MEMBER", "MANAGER"]);

export const createWorkspaceSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const workspaceSchema = createWorkspaceSchema.extend({
  id: z.string(),
  ownerId: z.string(),
});

export const createWorkspaceInvitationSchemaBody = z.object({
  workspaceName: z.string(),
  email: z.email(),
  status: workspaceRoles,
});

export const createWorkspaceParticipantSchema =
  createWorkspaceInvitationSchemaBody;

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

export const workspaceRequestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  workspaceId: z.string(),
});

export const membershipResultSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  isOwner: z.boolean(),
});

export const actionWorkspaceInvitationSchema = z.object({
  invitationId: z.string(),
  workspaceId: z.string(),
});

export const actionWorkspaceRequestSchema = z.object({
  requestId: z.string(),
  workspaceId: z.string(),
});

export const workspaceInfoSchema = z.object({
  title: z.string(),
  description: z.string(),
  todo: todoCountInfoSchema,
  countOfMembers: z.number(),
  role: workspaceRoles,
});

export const workspaceParticipantSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
  role: workspaceRoles.nullable(),
});

// code: z
//   .string()
//   .length(8)
//   .regex(/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/, {
//     message: "Invalid workspace code format",
//   }),

export const workspaceQueryParamsSchema = z.object({
  take: z.coerce.number().optional(),
});

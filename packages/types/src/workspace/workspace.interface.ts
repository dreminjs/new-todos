import * as z from "zod";
import {
  actionWorkspaceInvitationSchema,
  createWorkspaceInvitationSchema,
  createWorkspaceRequestSchema,
  createWorkspaceSchema,
  extendedWorkspaceInvitationSchema,
  membershipResultSchema,
  workspaceInvitationSchema,
  workspaceRequestSchema,
  workspaceSchema,
} from "./workspace.schema.js";

export type TWorkspace = z.infer<typeof workspaceSchema>;
export type TCreateWorkspace = z.infer<typeof createWorkspaceSchema>;
export type TCreateWorkspaceInvitation = z.infer<
  typeof createWorkspaceInvitationSchema
>;
export type TCreateWorkspaceRequest = z.infer<
  typeof createWorkspaceRequestSchema
>;
export type TWorkspaceRequest = z.infer<typeof workspaceRequestSchema>;

export type TWorkspaceInvitation = z.infer<typeof workspaceInvitationSchema>;

export type TExtendedWorkspaceInvitation = z.infer<
  typeof extendedWorkspaceInvitationSchema
>;

export interface IWorkspaceParticipant {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  id: string;
}

export interface IWorkspaceParticipantResponse {
  user: IWorkspaceParticipant;
}

export type TMembershipResult = z.infer<typeof membershipResultSchema>;

export type TActionWorkspaceInvitation = z.infer<
  typeof actionWorkspaceInvitationSchema
>;

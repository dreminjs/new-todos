import * as z from "zod";
import {
  actionWorkspaceInvitationSchema,
  actionWorkspaceRequestSchema,
  createWorkspaceInvitationSchemaBody,
  createWorkspaceSchema,
  extendedWorkspaceInvitationSchema,
  membershipResultSchema,
  workspaceInfoSchema,
  workspaceInvitationSchema,
  workspaceParticipantSchema,
  workspaceRequestSchema,
  workspaceStatuses,
  workspaceSchema,
} from "./workspace.schema.js";

export type TWorkspace = z.infer<typeof workspaceSchema>;
export type TCreateWorkspace = z.infer<typeof createWorkspaceSchema>;
export type TCreateWorkspaceInvitationBody = z.infer<
  typeof createWorkspaceInvitationSchemaBody
  >;

export type TWorkspaceRequest = z.infer<typeof workspaceRequestSchema>;

export type TWorkspaceInvitation = z.infer<typeof workspaceInvitationSchema>;

export type TExtendedWorkspaceInvitation = z.infer<
  typeof extendedWorkspaceInvitationSchema
>;

export interface IWorkspaceParticipantShortInfo {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  id: string;
}

export interface IWorkspaceParticipantResponse {
  user: IWorkspaceParticipantShortInfo;
}

export type TMembershipResult = z.infer<typeof membershipResultSchema>;

export type TActionWorkspaceInvitation = z.infer<
  typeof actionWorkspaceInvitationSchema
>;

export type TWorkspaceInfo = z.infer<typeof workspaceInfoSchema>;

export type TWorkspaceRoles = z.infer<typeof workspaceStatuses>;

export type TActionWorkspaceRequest = z.infer<
  typeof actionWorkspaceRequestSchema
>;

export type TWorkspaceParticipant = z.infer<typeof workspaceParticipantSchema>;

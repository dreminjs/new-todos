import * as z from "zod";
import {
  createWorkspaceInvitationSchema,
  createWorkspaceSchema,
  joinWorkspaceSchema,
  workspaceInvitationSchema,
  workspaceSchema,
} from "./workspace.schema.js";

export type TWorkspace = z.infer<typeof workspaceSchema>;
export type TCreateWorkspace = z.infer<typeof createWorkspaceSchema>;
export type TJoinWorkspace = z.infer<typeof joinWorkspaceSchema>;
export type TCreateWorkspaceInvitation = z.infer<
  typeof createWorkspaceInvitationSchema
>;
export type TWorkspaceInvitation = z.infer<typeof workspaceInvitationSchema>;

export interface IWorkspaceParticipant {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  id: string;
}

export interface IWorkspaceParticipantResponse {
  user: IWorkspaceParticipant;
}

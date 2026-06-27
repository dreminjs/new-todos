import * as z from "zod";
import {
  createWorkspaceInvitationSchema,
  createWorkspaceSchema,
  joinWorkspaceSchema,
  workspaceSchema,
} from "./workspace.schema.js";

export type TWorkspace = z.infer<typeof workspaceSchema>;
export type TCreateWorkspace = z.infer<typeof createWorkspaceSchema>;
export type TJoinWorkspace = z.infer<typeof joinWorkspaceSchema>;
export type TCreateWorkspaceInvitation = z.infer<
  typeof createWorkspaceInvitationSchema
>;

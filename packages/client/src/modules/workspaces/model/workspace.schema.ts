import { createWorkspaceInvitationSchemaBody } from "types";

export const workspaceInvitationFormSchema =
  createWorkspaceInvitationSchemaBody.omit({
    workspaceName: true,
  });

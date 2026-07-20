import { createWorkspaceInvitationSchema } from "types";

export const createWorkspaceInvitationFormSchema =
  createWorkspaceInvitationSchema.omit({
    workspaceId: true,
  });

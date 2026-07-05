import { createWorkspaceInvitationSchema } from "types";

export const workspaceInvitationFormSchema =
  createWorkspaceInvitationSchema.omit({
    workspaceId: true,
  });

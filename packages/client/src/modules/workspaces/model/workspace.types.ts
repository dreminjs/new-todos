import { workspaceInvitationFormSchema } from "./workspace.schema";
import { z } from "zod";

export type TWorkspaceInvitationForm = z.infer<
  typeof workspaceInvitationFormSchema
>;

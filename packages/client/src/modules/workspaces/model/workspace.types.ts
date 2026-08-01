import type { TActionWorkspaceInvitation, TActionWorkspaceRequest, TWorkspace } from "types";
import { workspaceInvitationFormSchema } from "./workspace.schema";
import { z } from "zod";

export type TWorkspaceInvitationForm = z.infer<
  typeof workspaceInvitationFormSchema
>;


export type TActionRequestParams = TActionWorkspaceRequest & {
  notificationId?: string;
};

export type TActionInviteParams = TActionWorkspaceInvitation & {
  notificationId?: string;
}

export type TCreateWorkspaceContext = {
  previousWorkspaces: TWorkspace[] | undefined;
  optimisticId: string;
};

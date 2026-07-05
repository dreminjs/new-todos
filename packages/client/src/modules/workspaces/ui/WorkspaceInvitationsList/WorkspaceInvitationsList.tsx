import type { FC } from "react";
import type { TExtendedWorkspaceInvitation } from "types";
import { WorkspaceInvitationListItem } from "./WorkspaceInvitationListItem";

interface IWorkspaceInvitationsListProps {
  invitations: TExtendedWorkspaceInvitation[];
}

export const WorkspaceInvitationsList: FC<IWorkspaceInvitationsListProps> = ({
  invitations,
}) => {
  return (
    <ul>
      {invitations.map((invitation) => (
        <WorkspaceInvitationListItem key={invitation.id} {...invitation} />
      ))}
    </ul>
  );
};

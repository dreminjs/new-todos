import type { FC } from "react";
import { Button } from "../../../../shared";
import { useRejectInvitation, useAcceptInvitation } from "../../api/queries";
import styles from "./WorkspaceInvitationsList.module.css";

interface IWorkspaceInvitationActionsProps {
  invitationId: string;
}

export const WorkspaceInvitationActions: FC<
  IWorkspaceInvitationActionsProps
> = ({ invitationId }) => {
  const { mutate: rejectInvitation } = useRejectInvitation();
  const { mutate: acceptInvitation } = useAcceptInvitation();
  return (
    <div className={styles.workspaceInvitationListItemActions}>
      <Button
        variant="secondary"
        onClick={rejectInvitation.bind(null, invitationId)}
      >
        Decline
      </Button>
      <Button onClick={acceptInvitation.bind(null, invitationId)}>
        Accept
      </Button>
    </div>
  );
};

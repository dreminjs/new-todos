import { formatDistanceToNow } from "date-fns";
import type { FC } from "react";
import type { TExtendedWorkspaceInvitation } from "types";
import { enGB } from "date-fns/locale";
import styles from "./WorkspaceInvitationsList.module.css";
import { WorkspaceInvitationActions } from "./WorkspaceInvitationActions";

type TWorkspaceInvitationListItemProps = TExtendedWorkspaceInvitation;

export const WorkspaceInvitationListItem: FC<
  TWorkspaceInvitationListItemProps
> = ({ createdAt, workspace, user, id }) => {
  const time = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: enGB,
  });
  return (
    <li className={styles.workspaceInvitationListItem}>
      <div>
        <h3>{workspace.name}</h3>
        <p>{`${user.firstName} ${user.lastName} invited you • ${time}`}</p>
      </div>
      <WorkspaceInvitationActions invitationId={id} />
    </li>
  );
};

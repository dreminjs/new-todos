import type { FC } from "react";
import styles from "./WorkspaceInvitationHeader.module.css";

interface IWorkspaceInvitationHeaderProps {
  count: number;
}

export const WorkspaceInvitationHeader: FC<IWorkspaceInvitationHeaderProps> = ({
  count,
}) => {
  return (
    <header className={styles.WorkspaceInvitationHeader}>
      <h3>Workspace Invitations</h3>
      <span>{count}</span>
    </header>
  );
};

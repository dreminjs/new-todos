import type { FC } from "react";
import type { IExtendedWorkspaceParticipant } from "types";
import styles from "./WorkspaceMembers.module.css";
import { LuEllipsis } from "react-icons/lu";
type TWorkspaceMemberItemProps = IExtendedWorkspaceParticipant;

export const WorkspaceMembersListItem: FC<TWorkspaceMemberItemProps> = ({
  user,
  role,
}) => {
  return (
    <li className={styles.workspaceMembersListItem}>
      <h3>{`${user.firstName} ${user.lastName} - ${role}`}</h3>
      <button>
        <LuEllipsis />
      </button>
    </li>
  );
};

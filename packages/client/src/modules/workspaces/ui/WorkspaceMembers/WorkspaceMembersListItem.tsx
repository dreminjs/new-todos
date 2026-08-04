import type { FC } from "react";
import type { IExtendedWorkspaceParticipant } from "types";
import styles from "./WorkspaceMembers.module.css";
import { WorkspaceMembersDropdown } from "./WorkspaceMembersDropdown";
type TWorkspaceMemberItemProps = IExtendedWorkspaceParticipant & {
  idDropdownShown: boolean;
  onKickUser: () => void

};

export const WorkspaceMembersListItem: FC<TWorkspaceMemberItemProps> = ({
  user,
  role,
  idDropdownShown,
  onKickUser
}) => {
  return (
    <li className={styles.workspaceMembersListItem}>
      <div>
        <h3>{`${user.firstName} ${user.lastName} - ${role}`}</h3>
        <h5>{user.email}</h5>
      </div>
      {idDropdownShown && (
        <WorkspaceMembersDropdown userRole={role} onKickUser={onKickUser} />
      )}
    </li>
  );
};

import { useGetParticipantsByWorkspaceId } from "../../api/queries";
import type { FC } from "react";
import { WorkspaceMembersListItem } from "./WorkspaceMembersListItem";
import styles from "./WorkspaceMembers.module.css"
interface IWorkspaceMembersListProps {
  workspaceId: string;
}

export const WorkspaceMembersList: FC<IWorkspaceMembersListProps> = ({
  workspaceId,
}) => {
  const { data } = useGetParticipantsByWorkspaceId(workspaceId);
  return (
    <>
      <ul className={styles.workspaceMembersList}>
        {data?.map((el) => (
          <WorkspaceMembersListItem
            key={el.id}
            user={el.user}
            role={el.role}
            id={el.id}
          />
        ))}
      </ul>
    </>
  );
};

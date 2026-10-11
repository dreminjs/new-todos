import { useLocation } from "react-router";
import { WorkspaceNavigationItem } from "./WorkspaceNavigationItem";
import styles from "./WorkspaceNavigation.module.css";
import type { FC } from "react";

interface IWorkspaceNavigationListProps {
  countOfMembers: number;
}

export const WorkspaceNavigationList: FC<IWorkspaceNavigationListProps> = ({
  countOfMembers,
}) => {
  const pathname = useLocation().pathname.split("/")[3];
  const workspaceId = useLocation().pathname.split("/")[2];
  return (
    <ul className={styles.workspaceNavigationList}>
      <WorkspaceNavigationItem
        isActive={pathname === undefined}
        href={workspaceId}
      >
        Home
      </WorkspaceNavigationItem>
      <WorkspaceNavigationItem
        isActive={pathname === "all-todos"}
        href={`${workspaceId}/all-todos`}
      >
        All tasks
      </WorkspaceNavigationItem>
      <WorkspaceNavigationItem
        isActive={pathname === `todo-groups`}
        href={`${workspaceId}/todo-groups`}
      >
        Todo groups
      </WorkspaceNavigationItem>
      <WorkspaceNavigationItem
        isActive={pathname === `chats`}
        href={`${workspaceId}/chats`}
      >
        Chats
      </WorkspaceNavigationItem>
      <WorkspaceNavigationItem
        isActive={pathname === `members`}
        href={`${workspaceId}/members`}
      >
        Members ({countOfMembers})
      </WorkspaceNavigationItem>
    </ul>
  );
};

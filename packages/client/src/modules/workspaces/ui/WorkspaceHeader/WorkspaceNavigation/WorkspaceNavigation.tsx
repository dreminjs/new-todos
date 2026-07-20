import { useLocation } from "react-router";
import { WorkspaceNavigationItem } from "./WorkspaceNavigationItem";
import styles from "./WorkspaceNavigation.module.css";
import type { FC } from "react";

interface IWorkspaceNavigationProps {
  countOfMembers: number;
}

export const WorkspaceNavigation: FC<IWorkspaceNavigationProps> = ({
  countOfMembers,
}) => {
  const pathname = useLocation().pathname.split("/")[3];
  const workspaceId = useLocation().pathname.split("/")[2];
  return (
    <nav>
      <ul className={styles.workspaceNavigation}>
        <WorkspaceNavigationItem isActive={pathname === undefined} href={workspaceId}>
          All tasks
        </WorkspaceNavigationItem>
        <WorkspaceNavigationItem
          isActive={pathname === `lists`}
          href={`${workspaceId}/lists`}
        >
          Lists
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
    </nav>
  );
};

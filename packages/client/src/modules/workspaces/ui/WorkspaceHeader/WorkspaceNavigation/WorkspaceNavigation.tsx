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
  const pathname = useLocation().pathname.split("/")[4] ?? "";
  return (
    <nav>
      <ul className={styles.workspaceNavigation}>
        <WorkspaceNavigationItem isActive={pathname === ""} href="">
          All tasks
        </WorkspaceNavigationItem>
        <WorkspaceNavigationItem isActive={pathname === "/lists"} href="/lists">
          Lists
        </WorkspaceNavigationItem>
        <WorkspaceNavigationItem isActive={pathname === "/chats"} href="/chats">
          Chats
        </WorkspaceNavigationItem>
        <WorkspaceNavigationItem isActive={pathname === "/me"} href="/members">
          Members ({countOfMembers})
        </WorkspaceNavigationItem>
      </ul>
    </nav>
  );
};

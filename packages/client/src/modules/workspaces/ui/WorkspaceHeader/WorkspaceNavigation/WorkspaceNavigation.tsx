import type { FC } from "react";
import { WorkspaceNavigationList } from "./WorkspaceNavigationList";
import styles from "./WorkspaceNavigation.module.css"
interface IWorkspaceNavigationProps {
  countOfMembers: number;
}

export const WorkspaceNavigation: FC<IWorkspaceNavigationProps> = ({
  countOfMembers,
}) => {
  return (
    <nav className={styles.workspaceNavigation}>
      <WorkspaceNavigationList countOfMembers={countOfMembers} />
    </nav>
  );
};

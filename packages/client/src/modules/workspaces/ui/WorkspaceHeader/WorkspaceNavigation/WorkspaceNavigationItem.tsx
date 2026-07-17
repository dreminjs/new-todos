import type { FC, ReactNode } from "react";
import styles from "./WorkspaceNavigation.module.css";
import { Link } from "react-router";
import clsx from "clsx";

type WorkspaceNavigationItemProps = {
  isActive: boolean;
  children: ReactNode;
  href: string;
}
export const WorkspaceNavigationItem: FC<WorkspaceNavigationItemProps> = ({
  href,
  isActive,
  children,
}) => {
  return (
    <Link
      to={href}
      className={clsx(
        styles.workspaceNavigationItem,
        isActive && styles.workspaceNavigationItemActive,
      )}
    >
      {children}
    </Link>
  );
};

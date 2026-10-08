import type { FC, ReactNode } from "react";
import styles from "./DashboardGrid.module.css";

interface IDashboardGridProps {
  children: ReactNode;
}

export const DashboardGrid: FC<IDashboardGridProps> = ({ children }) => {
  return <ul className={styles.grid}>{children}</ul>;
};

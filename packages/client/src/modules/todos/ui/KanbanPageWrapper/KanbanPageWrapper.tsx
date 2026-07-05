import type { FC } from "react";
import styles from "./KanbanPageWrapper.module.css";

interface IKanbanPageWrapper {
  children: React.ReactNode;
}

export const KanbanPageWrapper: FC<IKanbanPageWrapper> = ({ children }) => {
  return <div className={styles.kanbanPageWrapper}>{children}</div>;
};

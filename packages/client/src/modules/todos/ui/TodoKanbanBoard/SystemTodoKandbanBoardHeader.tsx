import type { FC } from "react";
import styles from "./TodoKanbanBoard.module.css";
interface ITodoKanbanBoardHeaderProps {
  icon: React.ReactNode;
  title: string;
}

export const SystemTodoKanbanBoardHeader: FC<ITodoKanbanBoardHeaderProps> = ({
  icon,
  title,
}) => {
  return (
    <header className={styles.TodoKanbanBoardHeader}>
      <div className={styles.TodoKanbanBoardHeaderTitleContainer}>
        {icon}
        <h3>{title}</h3>
      </div>
    </header>
  );
};

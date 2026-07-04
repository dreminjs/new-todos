import type { TTodo } from "types";
import styles from "./TodoKanbanBoard.module.css";

interface ITodoKanbanHeader {
  title: string;
  todos?: { pages: Array<{ items: Array<TTodo> }> };
  handleTodoModalToggle?: () => void;
  isPostDisabled: boolean;
}

export const TodoKanbanHeader = ({
  title,
  todos,
  handleTodoModalToggle,
  isPostDisabled,
}: ITodoKanbanHeader) => {
  return (
    <h3 className={styles.TodoKanbanBoardHeading}>
      <span>
        <span className={styles.TodoKanbanBoardStatus}>{title}</span>
        {todos && (
          <span className={styles.TodoKanbanBoardCount}>
            {todos?.pages.reduce((acc, page) => acc + page.items.length, 0)}
          </span>
        )}
      </span>
      {handleTodoModalToggle && (
        <button
          onClick={handleTodoModalToggle}
          className={styles.TodoKanbanBoardPlus}
          disabled={isPostDisabled}
        >
          +
        </button>
      )}
    </h3>
  );
};

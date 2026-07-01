import type { TTodo } from "types";
import styles from "./TodoKanbanBoard.module.css";

interface ITodoKanbanHeader {
  title: string;
  todos: { pages: Array<{ items: Array<TTodo> }> };
  handleTodoModalToggle: () => void;
}

export const TodoKanbanHeader = ({
  title,
  todos,
  handleTodoModalToggle,
}: ITodoKanbanHeader) => {
  return (
    <h3 className={styles.TodoKanbanBoardHeading}>
      <span>
        <span className={styles.TodoKanbanBoardStatus}>{title}</span>
        <span className={styles.TodoKanbanBoardCount}>
          {todos.pages.reduce((acc, page) => acc + page.items.length, 0)}
        </span>
      </span>
      <button
        onClick={handleTodoModalToggle}
        className={styles.TodoKanbanBoardPlus}
      >
        +
      </button>
    </h3>
  );
};

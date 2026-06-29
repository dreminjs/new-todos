import { useDraggable } from "@dnd-kit/react";
import type { FC } from "react";
import type { TTodo } from "types";
export type TProps = TTodo;
import styles from "./TodoKanbanBoard.module.css";

export const TodoItem: FC<TProps> = ({ title, id, priority }) => {
  const { ref } = useDraggable({
    id: `draggable_${id}`,
  });

  console.log(priority);

  return (
    <li className={styles.TodoItem} ref={ref}>
      {title} - {priority}
    </li>
  );
};

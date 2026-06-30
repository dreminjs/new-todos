import { useDraggable } from "@dnd-kit/react";
import type { FC } from "react";
import type { TTodo } from "types";
import { TODO_PRIORITY_CLASSES } from "../../model/todo.constants";
import { format } from "date-fns";
import { LuCalendar } from "react-icons/lu";
import styles from "./TodoKanbanBoard.module.css";
import clsx from "clsx";
export type TProps = TTodo & { isOverlay?: boolean };

export const TodoItem: FC<TProps> = ({
  title,
  id,
  priority,
  status,
  ...props
}) => {
  const { ref, isDragging } = useDraggable({
    id: `draggable_${id}`,
    data: {
      status,
      title,
      id,
      priority,
      ...props,
    },
  });

  return (
    <li
      className={clsx(
        styles.TodoItem,
        status === "COMPLETED" && styles.TodoItemComplete,
      )}
      ref={props.isOverlay ? undefined : ref}
      style={{ opacity: props.isOverlay ? 1 : isDragging ? 0 : 1 }}
    >
      <h5 className={styles.TodoItemName}>{title}</h5>
      <div className={styles.TodoItemBottom}>
        <divs
          className={clsx(
            styles.TodoItemPriority,
            TODO_PRIORITY_CLASSES[priority],
          )}
        />
        {props.deadline && (
          <div className={styles.TodoItemDeadline}>
            <LuCalendar />
            <span>{format(new Date(props.deadline), "MMM d")}</span>
          </div>
        )}
      </div>
    </li>
  );
};

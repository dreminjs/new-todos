import { useDraggable } from "@dnd-kit/react";
import { format } from "date-fns";
import { TODO_PRIORITY_CLASSES } from "../../model/todo.constants";
import { LuCalendar, LuTimerOff } from "react-icons/lu";
import { formatToLocalYYYYMMDD } from "../../../../shared/model/date.helper";
import type { TTodo } from "types";
import type { FC } from "react";
import styles from "./TodoKanbanBoard.module.css";
import clsx from "clsx";
type TProps = TTodo & { isOverlay?: boolean };
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
  const isExpired =
    new Date(props.deadline) < new Date(formatToLocalYYYYMMDD(new Date()));

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
        <div
          className={clsx(
            styles.TodoItemPriority,
            TODO_PRIORITY_CLASSES[priority],
          )}
        />
        {props.deadline && (
          <div
            className={clsx(
              styles.TodoItemDeadline,
              isExpired && styles.TodoItemExpired,
            )}
          >
            {isExpired ? <LuTimerOff /> : <LuCalendar />}

            <span>{format(new Date(props.deadline), "MMM d")}</span>
          </div>
        )}
      </div>
    </li>
  );
};

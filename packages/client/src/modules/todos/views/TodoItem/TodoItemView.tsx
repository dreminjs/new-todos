import type { FC } from "react";
import clsx from "clsx";
import { format } from "date-fns";
import { LuTimerOff, LuCalendar } from "react-icons/lu";
import styles from "./TodoItemView.module.css";
import { TODO_PRIORITY_CLASSES } from "../../model/todo.constants";
interface ITodoItemViewProps {
  isOverlay?: boolean;
  isDragging?: boolean;
  status?: string;
  title?: string;
  priority?: number;
  deadline?: string;
  isExpired?: boolean;
  ref?: (el: Element) => void;
  onClick?: () => void;
}

export const TodoItemView: FC<ITodoItemViewProps> = ({
  isOverlay,
  isDragging,
  status,
  title,
  priority,
  deadline,
  isExpired,
  ref,
  onClick,
}) => {
  return (
    <>
      <li className={clsx(styles.TodoItem)}>
        <button
          onClick={onClick}
          ref={isOverlay ? undefined : ref}
          style={{ opacity: isOverlay ? 1 : isDragging ? 0 : 1 }}
        >
          <h5
            className={clsx(
              styles.TodoItemName,
              status === "COMPLETED" && styles.TodoItemComplete,
            )}
          >
            {title}
          </h5>
          <div className={styles.TodoItemBottom}>
            <div
              className={clsx(
                styles.TodoItemPriority,
                TODO_PRIORITY_CLASSES[priority],
              )}
            />
            {deadline && (
              <div
                className={clsx(
                  styles.TodoItemDeadline,
                  isExpired && styles.TodoItemExpired,
                )}
              >
                {isExpired ? <LuTimerOff /> : <LuCalendar />}

                <span>{format(new Date(deadline), "MMM d")}</span>
              </div>
            )}
          </div>
        </button>
      </li>
    </>
  );
};

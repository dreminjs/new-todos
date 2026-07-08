import type { FC } from "react";
import clsx from "clsx";
import { format } from "date-fns";
import {
  LuTimerOff,
  LuCalendar,
  LuSun,
  LuSquareBottomDashedScissors,
  LuText,
  LuTextCursor,
  LuTextQuote,
  LuTextSelect,
  LuBookText,
} from "react-icons/lu";
import styles from "./TodoItemView.module.css";
import { TODO_PRIORITY_CLASSES } from "../../model/todo.constants";
import type { TTodoGroup, TWorkspace } from "types";
interface ITodoItemViewProps {
  isOverlay?: boolean;
  isDragging?: boolean;
  status?: string;
  title?: string;
  priority?: string;
  deadline?: string;
  isExpired?: boolean;
  ref?: (el: Element) => void;
  onClick?: () => void;
  todoGroup: TTodoGroup | null;
  workspace: TWorkspace | null;
  isMyToday: boolean;
  isDescriptionVisible: boolean;
  className?: string;
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
  todoGroup,
  workspace,
  isMyToday,
  isDescriptionVisible,
  className,
}) => {
  return (
    <>
      <li className={clsx(styles.TodoItem, className)}>
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
            <div className={styles.TodoItemBottomInfo}>
              {todoGroup && <span>{todoGroup.name}</span>}
              {workspace && <span>{workspace.name}</span>}
              {isMyToday && <LuSun />}
              {isDescriptionVisible && <LuBookText />}
              {deadline && (
                <div
                  className={clsx(
                    styles.TodoItemDeadline,
                    isExpired && styles.TodoItemExpired,
                  )}
                >
                  {isExpired ? <LuTimerOff /> : <LuCalendar />}

                  <span>{deadline}</span>
                </div>
              )}
            </div>
          </div>
        </button>
      </li>
    </>
  );
};

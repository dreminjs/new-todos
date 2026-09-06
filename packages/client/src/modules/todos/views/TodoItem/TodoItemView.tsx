import type { FC, RefObject } from "react";
import clsx from "clsx";
import { LuTimerOff, LuCalendar, LuSun, LuBookText } from "react-icons/lu";
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
  liRef?: RefObject<HTMLLIElement>;
  onClick?: () => void;
  todoGroup: TTodoGroup | null;
  workspace: TWorkspace | null;
  isMyToday: boolean;
  description?: string;
  className?: string;
  isBeingDraggedRemotely?: boolean;
  disableToClick: boolean;
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
  liRef,
  onClick,
  todoGroup,
  workspace,
  isMyToday,
  className,
  isBeingDraggedRemotely,
  disableToClick,
  description,
}) => {
  return (
    <>
      <li ref={liRef} className={clsx(styles.TodoItem, className)}>
        <button
          onClick={disableToClick ? undefined : onClick}
          ref={isOverlay ? undefined : ref}
          style={{
            opacity: isOverlay
              ? 1
              : isDragging || isBeingDraggedRemotely
                ? 0.3
                : 1,
          }}
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
              {description && <LuBookText />}
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

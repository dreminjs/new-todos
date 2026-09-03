import { useDraggable } from "@dnd-kit/react";
import { formatToLocalYYYYMMDD } from "../../../../shared/model/lib/date.helper";
import { TodoItemView } from "../../views/TodoItem";
import type { TExtendedTodo } from "types";
import { useEffect, useRef, useState, type FC } from "react";
import { format } from "date-fns/format";
import styles from "./TodoKanbanBoard.module.css";
import clsx from "clsx";
import { useIsTodoMutating } from "../../model/hooks/useIsTodoMutating";
import { useIsOnline } from "../../../../hooks/useIsOnline";
import { useDraggingTodosStore } from "../../model/drag-todos.store";
import { RemoteDraggingGhost } from "./RemoteDraggingGhost";

type TProps = TExtendedTodo & {
  isOverlay?: boolean;
  onChoose?: () => void;
  isLoading?: boolean;
  currentUserId: string;
};
export const TodoItem: FC<TProps> = ({
  title,
  id,
  priority,
  status,
  onChoose,
  ...props
}) => {
  const draggingUser = useDraggingTodosStore(
    (state) => state.draggingTodos[id],
  );
  const isOnline = useIsOnline();
  const itemRef = useRef<HTMLLIElement | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  const { ref, isDragging } = useDraggable({
    id: `draggable_${id}`,
    disabled: !isOnline,
    data: {
      status,
      title,
      id,
      priority,
      ...props,
    },
  });

  useEffect(() => {
    if (draggingUser && itemRef.current) {
      setOriginRect(itemRef.current.getBoundingClientRect());
    } else {
      setOriginRect(null);
    }
  }, [draggingUser]);

  const isExpired =
    new Date(props.deadline) < new Date(formatToLocalYYYYMMDD(new Date()));
  const formattedDeadline = props.deadline
    ? format(new Date(props.deadline), "MMM d")
    : undefined;
  const isMutating = useIsTodoMutating({
    todoId: id,
    todoGroupId: props.todoGroup?.id,
  });
  return (
    <>
      <TodoItemView
        isMyToday={props.isMyToday}
        deadline={formattedDeadline}
        isExpired={isExpired}
        isOverlay={props.isOverlay}
        title={title}
        ref={ref}
        liRef={itemRef}
        isDragging={isDragging}
        isBeingDraggedRemotely={Boolean(draggingUser)}
        onClick={onChoose}
        status={status}
        priority={priority}
        todoGroup={props.todoGroup}
        workspace={props.workspace}
        className={clsx(isMutating && styles.todoItemLoading)}
        isDescriptionVisible={Boolean(props.description)}
        disableToClick={props.currentUserId != props.assignee.id}
      />

      {draggingUser && originRect && (
        <RemoteDraggingGhost
          title={title}
          originRect={originRect}
          x={draggingUser.x}
          y={draggingUser.y}
        />
      )}
    </>
  );
};

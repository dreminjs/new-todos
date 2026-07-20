import { useDraggable } from "@dnd-kit/react";
import { formatToLocalYYYYMMDD } from "../../../../shared/model/lib/date.helper";
import { TodoItemView } from "../../views/TodoItem";
import type { TExtendedTodo } from "types";
import type { FC } from "react";
import { format } from "date-fns/format";
import styles from "./TodoKanbanBoard.module.css";
import clsx from "clsx";
import { useIsTodoMutating } from "../../model/hooks/useIsTodoMutating";
import { useIsOnline } from "../../../../hooks/useIsOnline";

type TProps = TExtendedTodo & {
  isOverlay?: boolean;
  onChoose?: () => void;
  isLoading?: boolean;
};
export const TodoItem: FC<TProps> = ({
  title,
  id,
  priority,
  status,
  onChoose,
  ...props
}) => {

  const isOnline = useIsOnline()

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
    <TodoItemView
      isMyToday={props.isMyToday}
      deadline={formattedDeadline}
      isExpired={isExpired}
      isOverlay={props.isOverlay}
      title={title}
      ref={ref}
      isDragging={isDragging}
      onClick={onChoose}
      status={status}
      priority={priority}
      todoGroup={props.todoGroup}
      workspace={props.workspace}
      className={clsx(isMutating && styles.todoItemLoading)}
      isDescriptionVisible={Boolean(props.description)}
    />
  );
};

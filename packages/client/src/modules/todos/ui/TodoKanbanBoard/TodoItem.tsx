import { useDraggable } from "@dnd-kit/react";
import { formatToLocalYYYYMMDD } from "../../../../shared/model/date.helper";
import { TodoItemView } from "../../views/TodoItem";
import type { TExtendedTodo } from "types";
import type { FC } from "react";
import { format } from "date-fns/format";
type TProps = TExtendedTodo & { isOverlay?: boolean; onChoose?: () => void };
export const TodoItem: FC<TProps> = ({
  title,
  id,
  priority,
  status,
  onChoose,
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

  const formattedDeadline = props.deadline
    ? format(new Date(props.deadline), "MMM d")
    : undefined;

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
      isDescriptionVisible={Boolean(props.description)}
    />
  );
};

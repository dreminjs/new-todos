import { useDraggable } from "@dnd-kit/react";
import { formatToLocalYYYYMMDD } from "../../../../shared/model/date.helper";
import { TodoItemView } from "../../views/TodoItem";
import type { TTodo } from "types";
import type { FC } from "react";
type TProps = TTodo & { isOverlay?: boolean; onChoose?: () => void };
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

  return (
    <TodoItemView
      deadline={props.deadline}
      isExpired={isExpired}
      isOverlay={props.isOverlay}
      title={title}
      ref={ref}
      isDragging={isDragging}
      onClick={onChoose}
      status={status}
    />
  );
};

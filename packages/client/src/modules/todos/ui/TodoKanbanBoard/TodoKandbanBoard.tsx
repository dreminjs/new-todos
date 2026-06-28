import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { type FC } from "react";
import { TodoKanbanColumn } from "./TodoKanbanColumn";
import styles from "./TodoKanbanBoard.module.css";
import type {
  ICreateTodoContext,
  TFindAllQuery,
} from "../../model/todo.interface";
import { useUpdateTodoStatus } from "../../api/queries";
import type { TTodoStatus } from "types";

type TTodoKanbanBoardProps = Omit<TFindAllQuery, "status"> & {
  showAssignee: boolean;
} & Omit<ICreateTodoContext, "status">;
export const TodoKanbanBoard: FC<TTodoKanbanBoardProps> = ({
  showAssignee,
  ...props
}) => {
  const { mutate: updateStatus } = useUpdateTodoStatus();

  const handleDragEnd = (e: DragEndEvent) => {
    const todoId = e.operation.source?.id.toString().split("_")[1] as string;
    const newStatus = e.operation.target?.id as TTodoStatus;
    console.log(e.operation.source.id.toString().split("_")[1]);

    const currentStatus = e.operation.source?.data?.status as TTodoStatus;
    if (currentStatus === newStatus) return;

    updateStatus({ todoId: todoId, dto: { status: newStatus } });
  };

  return (
    <>
      <DragDropProvider onDragEnd={handleDragEnd}>
        <ul className={styles.TodoKanbanBoardList}>
          <TodoKanbanColumn
            showAssignee={showAssignee}
            title={"PENDING"}
            status="PENDING"
            {...props}
          />
          <TodoKanbanColumn
            showAssignee={showAssignee}
            title={"IN PROGRESS"}
            status={"IN_PROGRESS"}
            {...props}
          />
          <TodoKanbanColumn
            showAssignee={showAssignee}
            title={"COMPLETED"}
            status={"COMPLETED"}
            {...props}
          />
          <TodoKanbanColumn
            showAssignee={showAssignee}
            title={"CANCELLED"}
            status={"CANCELLED"}
            {...props}
          />
        </ul>
      </DragDropProvider>
    </>
  );
};

import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { type FC } from "react";
import { TodoKanbanColumn } from "./TodoKanbanColumn";
import styles from "./TodoKanbanBoard.module.css";
import type {
  ICreateTodoContext,
  TFindAllQuery,
} from "../../model/todo.interface";
import { useUpdateTodoStatus } from "../../api/queries";
import type { TTodo } from "types";
import {} from "@dnd-kit/dom";
import { TodoItem } from "./TodoItem";
type TTodoKanbanBoardProps = Omit<TFindAllQuery, "status"> & {
  showAssignee: boolean;
} & Omit<ICreateTodoContext, "status">;
export const TodoKanbanBoard: FC<TTodoKanbanBoardProps> = ({
  showAssignee,
  ...props
}) => {
  const { setActiveTodo, handleDragEnd, activeTodo } = useUpdateTodoStatus();

  return (
    <>
      <DragDropProvider
        onDragStart={(e) => {
          const data = e.operation.source?.data;
          setActiveTodo({
            id: data?.id,
            title: data?.title,
            priority: data?.priority,
            status: data?.status,
          } as TTodo);
        }}
        onDragEnd={handleDragEnd}
      >
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
        <DragOverlay>
          {activeTodo && <TodoItem {...activeTodo} isOverlay={true} />}
        </DragOverlay>
      </DragDropProvider>
    </>
  );
};

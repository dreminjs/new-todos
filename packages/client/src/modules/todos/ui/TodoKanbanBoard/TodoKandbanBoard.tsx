import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { TodoKanbanColumn } from "./TodoKanbanColumn";
import type {
  ICreateTodoContext,
  TFindAllQuery,
} from "../../model/todo.interface";
import { useUpdateTodoStatus } from "../../api/queries";
import { TodoItem } from "./TodoItem";
import { type FC } from "react";
import type { TTodo } from "types";
import styles from "./TodoKanbanBoard.module.css";
type TTodoKanbanBoardProps = {
  showAssignee?: boolean;
  endpoint?: string;
  todoGroupId?: string;
  queryFilters?: TFindAllQuery;
  dtoContext?: Omit<ICreateTodoContext, "deadline" | "status">;
};
export const TodoKanbanBoard: FC<TTodoKanbanBoardProps> = ({
  showAssignee,
  endpoint,
  queryFilters,
  dtoContext,
}) => {
  const { setActiveTodo, handleDragEnd, activeTodo } =
    useUpdateTodoStatus(queryFilters);
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
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"PENDING"}
            dtoContext={{ ...dtoContext, status: "PENDING" }}
            queryFilters={{ ...queryFilters, status: "PENDING" }}
          />
          <TodoKanbanColumn
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"IN PROGRESS"}
            dtoContext={{ ...dtoContext, status: "IN_PROGRESS" }}
            queryFilters={{ ...queryFilters, status: "IN_PROGRESS" }}
          />
          <TodoKanbanColumn
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"COMPLETED"}
            queryFilters={{ ...queryFilters, status: "COMPLETED" }}
            dtoContext={{ ...dtoContext, status: "COMPLETED" }}
          />
          <TodoKanbanColumn
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"CANCELLED"}
            queryFilters={{ ...queryFilters, status: "CANCELLED" }}
            dtoContext={{ ...dtoContext, status: "CANCELLED" }}
          />
        </ul>
        <DragOverlay>
          {activeTodo && <TodoItem {...activeTodo} isOverlay={true} />}
        </DragOverlay>
      </DragDropProvider>
    </>
  );
};

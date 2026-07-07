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
  queryFilters?: Omit<TFindAllQuery, "status">;
} & Omit<ICreateTodoContext, "status" | "deadline">;
export const TodoKanbanBoard: FC<TTodoKanbanBoardProps> = ({
  showAssignee,
  endpoint,
  queryFilters,
  ...props
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
            status="PENDING"
            queryFilters={queryFilters}
            priority={props.priority}
            isMyToday={props.isMyToday}
          />
          <TodoKanbanColumn
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"IN PROGRESS"}
            status={"IN_PROGRESS"}
            queryFilters={queryFilters}
            priority={props.priority}
            isMyToday={props.isMyToday}
          />
          <TodoKanbanColumn
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"COMPLETED"}
            status={"COMPLETED"}
            queryFilters={queryFilters}
            priority={props.priority}
            isMyToday={props.isMyToday}
          />
          <TodoKanbanColumn
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"CANCELLED"}
            status={"CANCELLED"}
            queryFilters={queryFilters}
            priority={props.priority}
            isMyToday={props.isMyToday}
          />
        </ul>
        <DragOverlay>
          {activeTodo && <TodoItem {...activeTodo} isOverlay={true} />}
        </DragOverlay>
      </DragDropProvider>
    </>
  );
};

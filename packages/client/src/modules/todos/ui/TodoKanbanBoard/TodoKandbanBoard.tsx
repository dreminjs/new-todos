import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { type FC } from "react";
import { TodoKanbanColumn } from "./TodoKanbanColumn";
import type {
  ICreateTodoContext,
  TFindAllQuery,
} from "../../model/todo.interface";
import { useUpdateTodoStatus } from "../../api/queries";
import { TodoItem } from "./TodoItem";
import type { TTodo } from "types";
import styles from "./TodoKanbanBoard.module.css";
type TTodoKanbanBoardProps = Omit<TFindAllQuery, "status"> & {
  showAssignee?: boolean;
  endpoint?: string;
  todoGroupId?: string;
} & Omit<ICreateTodoContext, "status">;
export const TodoKanbanBoard: FC<TTodoKanbanBoardProps> = ({
  showAssignee,
  endpoint,
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
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"PENDING"}
            status="PENDING"
            {...props}
          />
          <TodoKanbanColumn
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"IN PROGRESS"}
            status={"IN_PROGRESS"}
            {...props}
          />
          <TodoKanbanColumn
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"COMPLETED"}
            status={"COMPLETED"}
            {...props}
          />
          <TodoKanbanColumn
            endpoint={endpoint}
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

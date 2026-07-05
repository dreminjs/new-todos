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
import { toDate } from "../../../../shared/model/date.helper";
type TTodoKanbanBoardProps = Omit<TFindAllQuery, "status" | "deadline"> & {
  showAssignee?: boolean;
  endpoint?: string;
  todoGroupId?: string;
  deadline?: string;
} & Omit<ICreateTodoContext, "status" | "deadline">;
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
            {...props}
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"PENDING"}
            status="PENDING"
            deadline={toDate(props.deadline)}
          />
          <TodoKanbanColumn
            {...props}
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"IN PROGRESS"}
            status={"IN_PROGRESS"}
            deadline={toDate(props.deadline)}
          />
          <TodoKanbanColumn
            {...props}
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"COMPLETED"}
            status={"COMPLETED"}
            deadline={toDate(props.deadline)}
          />
          <TodoKanbanColumn
            {...props}
            endpoint={endpoint}
            showAssignee={showAssignee}
            title={"CANCELLED"}
            status={"CANCELLED"}
            deadline={toDate(props.deadline)}
          />
        </ul>
        <DragOverlay>
          {activeTodo && <TodoItem {...activeTodo} isOverlay={true} />}
        </DragOverlay>
      </DragDropProvider>
    </>
  );
};

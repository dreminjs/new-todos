import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { TodoKanbanColumn } from "./TodoKanbanColumn";
import { useUpdateTodoStatus } from "../../api/queries";
import { TodoItem } from "./TodoItem";
import { useRef, type FC } from "react";
import { useIsOnline } from "../../../../hooks/useIsOnline";
import { useCanUserChangeStatusOfTodo } from "../../model/hooks/useCanUserChangeStatusOfTodo";
import { useSocket } from "../../../../app/model/useSocket";
import { useDraggingTodosStore } from "../../model/drag-todos.store";
import type { TFindAllQuery, TTodoDtoContext } from "../../model/todo.types";
import type { TExtendedTodo } from "types";
import styles from "./TodoKanbanBoard.module.css";
import clsx from "clsx";
import { useEmitTodoDragPosition } from "../../model/hooks/useEmitTodoDragPosition";
import { useRemoteTodoDragSync } from "../../model/hooks/useRemoteTodoDragSync";
type TTodoKanbanBoardProps = {
  showAssignee?: boolean;
  endpoint?: string;
  todoGroupId?: string;
  queryFilters?: TFindAllQuery;
  dtoContext?: TTodoDtoContext;
};
export const TodoKanbanBoard: FC<TTodoKanbanBoardProps> = ({
  showAssignee,
  endpoint,
  queryFilters,
  dtoContext,
}) => {
  const { setActiveTodo, handleDragEnd, activeTodo } =
    useUpdateTodoStatus(queryFilters);
  const { isOwnerOrManager, currentUserId } = useCanUserChangeStatusOfTodo();
  const clearDrag = useDraggingTodosStore((state) => state.clearDrag);
  const isOnline = useIsOnline();
  const socket = useSocket();
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const emitDragPosition = useEmitTodoDragPosition(dtoContext);
  useRemoteTodoDragSync();

  return (
    <DragDropProvider
      onDragStart={(e) => {
        const data = e.operation.source?.data as TExtendedTodo;
        if (isOwnerOrManager || data?.assignee?.id === currentUserId) {
          const rect = (
            e.operation.source?.element as HTMLElement
          )?.getBoundingClientRect();
          startPos.current = rect ? { x: rect.left, y: rect.top } : null;
          setActiveTodo({
            id: data?.id,
            title: data?.title,
            priority: data?.priority,
            status: data?.status,
            assignee: data.assignee,
          } as unknown as TExtendedTodo);
        }
      }}
      onDragMove={(e) => {
        const data = e.operation.source?.data as TExtendedTodo;
        const delta = e.operation.transform;
        if (!activeTodo || !data?.id || !currentUserId) return;

        if (!delta) return;
        if (!startPos.current) return;
        emitDragPosition({
          todoId: data.id,
          y: delta.y,
          x: delta.x,
        });
      }}
      onDragEnd={(e) => {
        const data = e.operation.source?.data as TExtendedTodo;
        if (isOwnerOrManager || data.assignee?.id === currentUserId) {
          handleDragEnd(e);
          clearDrag(data.id);
          socket?.emit("todo:drag-end", {
            todoId: data.id,
            todoGroupId: dtoContext.todoGroupId,
            workspaceId: dtoContext.workspaceId,
          });
        }
      }}
    >
      <ul
        className={clsx(
          styles.TodoKanbanBoardList,
          !isOnline && styles.TodoKanbanBoardListOffline,
        )}
      >
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
        {activeTodo && (
          <TodoItem
            currentUserId={currentUserId}
            isOverlay={true}
            assignee={activeTodo.assignee}
            {...activeTodo}
          />
        )}
      </DragOverlay>
    </DragDropProvider>
  );
};

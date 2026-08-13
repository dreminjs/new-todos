import { useEffect } from "react";
import { useDraggingTodosStore } from "../drag-todos.store";
import { useCanUserChangeStatusOfTodo } from "./useCanUserChangeStatusOfTodo";
import { useSocket } from "../../../../app/model/useSocket";
import type { TodoDragPositionPayload } from "types";

export const useRemoteTodoDragSync = () => {
  const socket = useSocket();
  const { currentUserId } = useCanUserChangeStatusOfTodo();
  const setDragPosition = useDraggingTodosStore(
    (state) => state.setDragPosition,
  );
  const clearDrag = useDraggingTodosStore((state) => state.clearDrag);

  useEffect(() => {
    if (!socket) return;

    const handlePosition = (payload: TodoDragPositionPayload) => {
      setDragPosition(payload.todoId, {
        x: payload.x,
        y: payload.y,
      });
    };
    const handleDragEnd = ({ todoId }: { todoId: string }) => clearDrag(todoId);

    socket.on("todo:drag-position", handlePosition);
    socket.on("todo:drag-end", handleDragEnd);

    return () => {
      socket.off("todo:drag-position", handlePosition);
      socket.off("todo:drag-end", handleDragEnd);
    };
  }, [socket, currentUserId, setDragPosition, clearDrag]);
};

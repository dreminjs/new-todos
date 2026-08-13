import type { TodoDragPositionPayload } from "types";
import { useSocket } from "../../../../app/model/useSocket";
import { useMemo } from "react";
import { throttle } from "lodash";
import type { TTodoDtoContext } from "../todo.types";

export const useEmitTodoDragPosition = (dtoContext: TTodoDtoContext) => {
  const socket = useSocket();
  return useMemo(
    () =>
      throttle(
        (
          payload: Omit<TodoDragPositionPayload, "todoGroupId" | "workspaceId">,
        ) => {
          socket?.volatile.emit("todo:drag-position", {
            ...payload,
            ...dtoContext,
          });
        },
        50,
      ),
    [socket, dtoContext],
  );
};

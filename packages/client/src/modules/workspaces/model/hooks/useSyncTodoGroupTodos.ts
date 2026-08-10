import { useEffect } from "react";
import { useSocket } from "../../../../app/model/useSocket";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type { IItemsResponse, TExtendedTodo, TTodo } from "types";
import { getTodosQueryKey } from "../../../todos/model/todo.helper";

export const useSyncWorkspaceTodoGroupTodos = ({
  todoGroupId,
  workspaceId,
}: {
  todoGroupId: string;
  workspaceId: string;
}) => {
  const socket = useSocket();
  const client = useQueryClient();
  useEffect(() => {
    if (!socket || !todoGroupId || !workspaceId) return;
    socket.emit("join-group-todos-room", {
      todoGroupId: todoGroupId,
      workspaceId: workspaceId,
    });
    socket.on("todos", (data: TExtendedTodo) => {
      const queryKey = getTodosQueryKey({
        todoGroupId: todoGroupId,
        workspaceId: workspaceId,
        status: data.status,
        limit: 10,
      });

      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;
          const alreadyExists = oldData.pages.some((page) =>
            page.items.some((item) => item.id === data.id),
          );
          if (alreadyExists) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: [data, ...page.items],
            })),
          };
        },
      );
    });
  }, [client, socket, todoGroupId, workspaceId]);
};

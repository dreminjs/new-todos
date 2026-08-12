import { useEffect } from "react";
import { useSocket } from "../../../../app/model/useSocket";
import {
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query";
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
    socket.on("todos:created", (data: TExtendedTodo) => {
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

    socket.on("todos:status-changed", (changedStatusTodo: TExtendedTodo) => {
      const previousData = client.getQueriesData<
        InfiniteData<IItemsResponse<TTodo>>
      >({ queryKey: ["todos"] });

      let sourceQueryKey: QueryKey | undefined;
      let movedTodo: TTodo | undefined;

      for (const [key, data] of previousData) {
        if (!data) continue;
        for (const page of data.pages) {
          const found = page.items.find((t) => t.id === changedStatusTodo.id);
          if (found) {
            movedTodo = found;
            sourceQueryKey = key;
            break;
          }
        }
        if (movedTodo) break;
      }

      if (!movedTodo || !sourceQueryKey) {
        return { previousData };
      }
      const targetQueryKey = getTodosQueryKey({
        status: changedStatusTodo.status,
        limit: 10,
        workspaceId: changedStatusTodo.workspace.id,
        todoGroupId: changedStatusTodo.todoGroup.id,
      });

      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        sourceQueryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((t) => t.id !== changedStatusTodo.id),
              total: page.items.length - 1,
            })),
          };
        },
      );

      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        targetQueryKey,
        (old) => {
          if (!old) return old;
          const [firstPage, ...restPages] = old.pages;
          return {
            ...old,
            pages: [
              {
                ...firstPage,
                items: [
                  { ...movedTodo, status: changedStatusTodo.status } as TTodo,
                  ...firstPage.items,
                ],
                total: firstPage.items.length + 1,
              },
              ...restPages,
            ],
          };
        },
      );

      return { previousData };
    });

    socket.on("todos:updated", (newTodo: TExtendedTodo) => {
      const queryKey = getTodosQueryKey({
        todoGroupId: newTodo.todoGroup.id,
        workspaceId: newTodo.workspace.id,
        status: newTodo.status,
        limit: 10,
      });
      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === newTodo.id ? newTodo : item,
              ),
            })),
          };
        },
      );
    });

    socket.on("todos:delete", (newTodo: TExtendedTodo) => {
      const queryKey = getTodosQueryKey({
        todoGroupId: newTodo.todoGroup.id,
        workspaceId: newTodo.workspace.id,
        status: newTodo.status,
        limit: 10,
      });
      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((item) => item.id !== newTodo.id),
            })),
          };
        },
      );
    });
  }, [client, socket, todoGroupId, workspaceId]);
};

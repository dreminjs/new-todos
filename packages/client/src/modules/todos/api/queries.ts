import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { createOne, findAll, updateStatus } from "./service";
import { useNotificationStore } from "../../notifications/model/notification.store";
import type {
  ICreateTodoContext,
  TCreateTodo,
  TFindAllQuery,
} from "../model/todo.interface";
import type { UseFormReset } from "react-hook-form";
import type {
  IItemsResponse,
  TTodo,
  TTodoStatus,
  TUpdateTodoStatus,
} from "types";
import type { DragEndEvent } from "@dnd-kit/react";
import { useState } from "react";

export const useCreateTodo = (
  dto: ICreateTodoContext,
  reset: UseFormReset<TCreateTodo>,
) => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const client = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: (data: TCreateTodo & ICreateTodoContext) => createOne(data),
    onSuccess: () => {
      addNotification({
        message: "Todo created successfully",
        type: "success",
      });
      client.invalidateQueries({ queryKey: ["todos"] });
      reset();
    },
    onError: () => {
      addNotification({
        message: "Failed to create todo",
        type: "error",
      });
      reset();
    },
  });

  const handleCreateTodo = (data: TCreateTodo) => {
    mutate({ ...dto, ...data });
  };

  return { ...rest, mutate: handleCreateTodo };
};

export const useGetTodos = (query: TFindAllQuery, endpoint?: string) => {
  return useInfiniteQuery({
    queryKey: ["todos", query],
    queryFn: () => findAll(query, endpoint),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useUpdateTodoStatus = () => {
  const queryClient = useQueryClient();
  const [activeTodo, setActiveTodo] = useState<TTodo | null>(null);
  const handleDragEnd = (e: DragEndEvent) => {
    const todoId = e.operation.source?.id.toString().split("_")[1] as string;
    const newStatus = e.operation.target?.id as TTodoStatus;

    console.log("todoId", todoId, "newStatus", newStatus);
    mutate({ todoId: todoId, dto: { status: newStatus } });
  };
  const { mutate } = useMutation({
    mutationFn: ({ todoId, dto }: { todoId: string; dto: TUpdateTodoStatus }) =>
      updateStatus(todoId, dto),

    onMutate: async ({ todoId, dto }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousData = queryClient.getQueriesData({ queryKey: ["todos"] });

      queryClient.setQueriesData(
        { queryKey: ["todos"] },
        (old: InfiniteData<IItemsResponse<TTodo>> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((todo) =>
                todo.id === todoId ? { ...todo, status: dto.status } : todo,
              ),
            })),
          };
        },
      );

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      context?.previousData.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return {
    updateStatus,
    handleDragEnd,
    activeTodo,
    setActiveTodo,
  };
};

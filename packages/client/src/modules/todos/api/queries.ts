import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  createOne,
  findAll,
  updateStatus,
  updateOne,
  deleteOne,
} from "./service";
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
import { getTodosQueryKey } from "../model/todo.helper";
import type { TCreateTodoForm } from "../model/buildTodo.schema";

export const useCreateTodo = ({
  queryKeyFilters,
  todoContext,
  cb,
}: {
  queryKeyFilters: TFindAllQuery;
  todoContext: ICreateTodoContext;
  cb: () => void;
}) => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const client = useQueryClient();
  const queryKey = getTodosQueryKey(queryKeyFilters);

  const { mutate, ...rest } = useMutation({
    mutationFn: (data: TCreateTodo & ICreateTodoContext) => createOne(data),

    onMutate: async (newTodo) => {
      await client.cancelQueries({ queryKey });

      const previousData =
        client.getQueryData<InfiniteData<IItemsResponse<TTodo>>>(queryKey);

      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        queryKey,
        (old) => {
          if (!old) return old;

          const [firstPage, ...restPages] = old.pages;

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                items: [
                  {
                    ...newTodo,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  } as TTodo,
                  ...firstPage.items,
                ],
                total: firstPage.total + 1,
              },
              ...restPages,
            ],
          };
        },
      );

      return { previousData };
    },

    onSuccess: (serverTodo) => {
      addNotification({
        message: "Todo created successfully",
        type: "success",
      });

      console.log(serverTodo);

      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        queryKey,
        (old) => {
          console.log(old);
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((todo) =>
                todo.id === serverTodo.id ? serverTodo : todo,
              ),
            })),
          };
        },
      );

      cb();
    },

    onError: (_err, _newTodo, context) => {
      addNotification({
        message: "Failed to create todo",
        type: "error",
      });

      if (context?.previousData) {
        client.setQueryData(queryKey, context.previousData);
      }

      cb();
    },
  });

  const handleMutate = (data: TCreateTodoForm) => {
    mutate({ ...data, ...todoContext });
  };

  return {
    mutate: handleMutate,
    ...rest,
  };
};

export const useGetTodos = (query: TFindAllQuery, endpoint?: string) => {
  return useInfiniteQuery({
    queryKey: getTodosQueryKey(query),
    queryFn: ({ pageParam }) => findAll(query, endpoint, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateTodoStatus = () => {
  const queryClient = useQueryClient();
  const [activeTodo, setActiveTodo] = useState<TTodo | null>(null);
  const handleDragEnd = (e: DragEndEvent) => {
    const todoId = e.operation.source?.id.toString().split("_")[1] as string;
    const newStatus = e.operation.target?.id as TTodoStatus;

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

export const useUpdateTodo = (
  dto: ICreateTodoContext & { todoId: string },
  reset: UseFormReset<TCreateTodo>,
) => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const client = useQueryClient();

  const todoId = dto.todoId;
  const { mutate, ...props } = useMutation({
    mutationFn: (dto: TCreateTodo) => updateOne(dto, todoId),
    onSuccess: () => {
      addNotification({
        message: "Todo updated successfully",
        type: "success",
      });
      client.invalidateQueries({ queryKey: ["todos", { status: dto.status }] });
      const previousData = client.getQueryData([
        "todos",
        { status: dto.status },
      ]);
      if (previousData) {
        client.setQueryData(["todos", { status: dto.status }], previousData);
      }
      return {
        previousData: previousData,
      };
    },
    onError: () => {
      addNotification({ message: "Failed to update todo", type: "error" });
      reset();
    },
  });
  const handleUpdateTodo = (data: TCreateTodo) => {
    mutate({ ...dto, ...data });
  };
  return {
    mutate: handleUpdateTodo,
    ...props,
  };
};

export const useDeleteTodo = (dto: TFindAllQuery) => {
  const client = useQueryClient();
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const { mutate, ...props } = useMutation({
    mutationFn: (todoId: string) => deleteOne(todoId),
    onSuccess: (_data, todoId) => {
      addNotification({
        message: "Todo deleted successfully",
        type: "success",
      });

      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        getTodosQueryKey(dto),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((todo) => todo.id !== todoId),
            })),
            total:
              oldData.pages.reduce((acc, page) => acc + page.items.length, 0) -
              1,
          };
        },
      );
    },
    onError: () => {
      addNotification({ message: "Failed to delete todo", type: "error" });
    },
  });

  return { mutate, ...props };
};

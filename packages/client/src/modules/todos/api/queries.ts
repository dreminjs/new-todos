import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query";
import {
  createOne,
  findAll,
  updateStatus,
  updateOne,
  deleteOne,
} from "./service";
import { useNotificationStore } from "../../notifications/model/notification.store";
import { useRef, useState } from "react";
import { getTodosQueryKey } from "../model/todo.helper";
import type {
  ICreateTodoContext,
  TCreateTodo,
  TFindAllQuery,
} from "../model/todo.interface";
import type { IItemsResponse, TExtendedTodo, TTodo, TTodoStatus } from "types";
import type { DragEndEvent } from "@dnd-kit/react";
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
    mutationKey: ["todo", "create"],
    onMutate: async (newTodo) => {
      cb();

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

      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        queryKey,
        (old) => {
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
    mutate({ ...data, ...todoContext, id: crypto.randomUUID() });
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

export const useUpdateTodoStatus = (query: Omit<TFindAllQuery, "status">) => {
  const client = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [activeTodo, setActiveTodo] = useState<TTodo | null>(null);

  const handleDragEnd = (e: DragEndEvent) => {
    const todoId = e.operation.source?.id.toString().split("_")[1] as string;
    const newStatus = e.operation.target?.id as TTodoStatus;
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    mutate({ todoId, newStatus, abortController: abortControllerRef.current });
  };

  const { mutate } = useMutation({
    mutationKey: ["todo", "update", "status"],
    mutationFn: ({
      todoId,
      newStatus,
      abortController,
    }: {
      todoId: string;
      newStatus: TTodoStatus;
      abortController: AbortController;
    }) => updateStatus(todoId, { status: newStatus }, abortController),

    onMutate: async ({ todoId, newStatus }) => {
      await client.cancelQueries({ queryKey: ["todos"] });

      const previousData = client.getQueriesData<
        InfiniteData<IItemsResponse<TTodo>>
      >({ queryKey: ["todos"] });

      let movedTodo: TTodo | undefined;
      let sourceQueryKey: QueryKey | undefined;

      for (const [key, data] of previousData) {
        if (!data) continue;
        for (const page of data.pages) {
          const found = page.items.find((t) => t.id === todoId);
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
        ...query,
        status: newStatus,
      } as TFindAllQuery);

      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        sourceQueryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((t) => t.id !== todoId),
              total: page.total - 1,
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
                  { ...movedTodo, status: newStatus } as TTodo,
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
    onSuccess: async (newTodo) => {
      const previousData = client.getQueriesData<
        InfiniteData<IItemsResponse<TTodo>>
      >({ queryKey: ["todos"] });

      let movedTodo: TTodo | undefined;
      let sourceQueryKey: QueryKey | undefined;

      for (const [key, data] of previousData) {
        if (!data) continue;
        for (const page of data.pages) {
          const found = page.items.find((t) => t.id === newTodo.id);
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
        ...query,
        status: newTodo.status,
      } as TFindAllQuery);

      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        sourceQueryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((t) => t.id !== newTodo.id),
              total: page.total - 1,
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
                  { ...movedTodo, status: newTodo.status } as TTodo,
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
  });

  return {
    mutate,
    handleDragEnd,
    activeTodo,
    setActiveTodo,
  };
};

export const useUpdateTodo = (
  dto: ICreateTodoContext,
  queryFilter: TFindAllQuery,
  cb: () => void,
) => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const client = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const todoId = dto.id;
  const { mutate, ...props } = useMutation({
    mutationFn: (dto: TCreateTodo) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      return updateOne(dto, todoId, abortControllerRef.current!);
    },
    mutationKey: ["todo", "update", todoId],
    networkMode: "always",
    onSuccess: (newTodo) => {
      addNotification({
        message: "Todo updated successfully",
        type: "success",
      });
      // console.log({ newTodo });
      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        getTodosQueryKey(queryFilter),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items
                .filter((item) => item.id !== todoId)
                .concat({ ...newTodo, id: newTodo.id }),
            })),
          };
        },
      );
    },
    onError: () => {
      addNotification({ message: "Failed to update todo", type: "error" });
      cb();
      const previous = client.getQueriesData<
        InfiniteData<IItemsResponse<TTodo>>
      >({
        queryKey: ["todos"],
      });
      return { previous };
    },
    onMutate: (newTodo: TExtendedTodo) => {
      cb();

      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        getTodosQueryKey(queryFilter),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items
                .filter((item) => item.id !== todoId)
                .concat({ ...newTodo, id: newTodo.id }),
            })),
          };
        },
      );
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

export const useDeleteTodo = (queryFilters: TFindAllQuery, cb: () => void) => {
  const client = useQueryClient();
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const { mutate, ...props } = useMutation({
    mutationFn: (todoId: string) => deleteOne(todoId),
    mutationKey: ["todo", "delete"],
    onSuccess: (_data, todoId) => {
      addNotification({
        message: "Todo deleted successfully",
        type: "success",
      });

      client.setQueriesData<InfiniteData<IItemsResponse<TTodo>>>(
        {
          queryKey: ["todos"],
        },
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
    onMutate: (todoId) => {
      cb();
      client.cancelQueries({
        queryKey: ["todos"],
      });

      client.setQueryData<InfiniteData<IItemsResponse<TTodo>>>(
        getTodosQueryKey(queryFilters),
        (old) => {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((el) => el.id !== todoId),
            })),
          };
        },
      );
    },
  });

  return { mutate, ...props };
};

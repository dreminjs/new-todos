import {
  useQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryFilters,
} from "@tanstack/react-query";
import {
  findGroups,
  createOne,
  updateOne,
  deleteOne,
  findOne,
} from "./service";
import { useSystemNotificationStore } from "../../system-notifications/model/notification.store";
import type {
  IItemsResponse,
  TCreateTodoGroupBody,
  TExtendedTodo,
  TTodo,
  TTodoGroup,
} from "types";
import type { TCreateTodoGroupForm } from "../model/todo-group.dto";
import { getTodosQueryKey } from "../../todos/model/todo.helper";
import type { TFindAllQuery } from "../../todos/model/todo.types";

export const useGetTodoGroups = () => {
  return useQuery({
    queryKey: ["todo-groups"],
    queryFn: findGroups,
  });
};

export const useCreateTodoGroup = () => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: TCreateTodoGroupBody) => createOne(data),
    onMutate: async (newTodoGroup) => {
      await client.cancelQueries({ queryKey: ["todo-groups"] });
      const previousData = client.getQueryData<TTodoGroup[]>(["todo-groups"]);
      const temporaryId = crypto.randomUUID();
      client.setQueryData<TTodoGroup[]>(["todo-groups"], (old) => [
        ...(old ?? []),
        { ...newTodoGroup, id: temporaryId },
      ]);
      return { previousData, temporaryId };
    },
    onSuccess: (todoGroup, _dto, context) => {
      addNotification({
        type: "success",
        message: "Todo group created successfully",
      });
      if (todoGroup.workspaceId) {
        client.invalidateQueries({
          queryKey: ["workspaces", todoGroup.workspaceId, "todo-groups"],
        });
      }
      client.setQueryData<TTodoGroup[]>(["todo-groups"], (old) =>
        (old ?? []).map((el) =>
          el.id === context.temporaryId ? todoGroup : el,
        ),
      );
    },
    onError: (_err, _dto, context) => {
      if (context.previousData) {
        client.setQueryData<TTodoGroup[]>(
          ["todo-groups"],
          context.previousData,
        );
      }
      addNotification({
        type: "error",
        message: "Failed to create todo group",
      });
    },
  });
};

export const useDeleteTodoGroup = () => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  const client = useQueryClient();

  return useMutation({
    mutationFn: deleteOne,
    onSuccess: () => {
      addNotification({
        type: "success",
        message: "Todo group deleted successfully",
      });
    },
    onMutate: (deletedTodoId) => {
      client.setQueryData<TTodoGroup[]>(["todo-groups"], (oldData) =>
        oldData.filter((todoGroup) => todoGroup.id !== deletedTodoId),
      );
    },

    onError: () => {
      addNotification({
        type: "error",
        message: "Failed to delete todo group",
      });
    },
  });
};
export const useUpdateTodoGroup = (id: string) => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );

  const todosQueryKey = getTodosQueryKey({ todoGroupId: id });
  const client = useQueryClient();

  const { mutate, ...props } = useMutation({
    mutationFn: (data: TCreateTodoGroupBody) => updateOne(data, id),
    mutationKey: ["todo-groups"],

    onMutate: async (newTodoGroup) => {
      await client.cancelQueries({ queryKey: ["todo-groups"] });

      const previous = client.getQueryData<TTodoGroup[]>(["todo-groups"]);

      client.setQueryData<TTodoGroup[]>(["todo-groups"], (old) =>
        old?.map((el) => (el.id === id ? { ...el, ...newTodoGroup } : el)),
      );

      return { previous };
    },

    onSuccess: (newTodoGroup) => {
      addNotification({
        type: "success",
        message: "Todo group updated successfully",
      });

      client.setQueryData<TTodoGroup[]>(["todo-groups"], (old) =>
        old?.map((el) => (el.id === id ? newTodoGroup : el)),
      );

      client.setQueriesData<InfiniteData<IItemsResponse<TTodo>>>(
        { queryKey: todosQueryKey },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.todoGroupId === id
                  ? { ...item, todoGroup: newTodoGroup }
                  : item,
              ),
            })),
          };
        },
      );
    },

    onError: (_err, _newTodoGroup, context) => {
      if (context?.previous) {
        client.setQueryData(["todo-groups"], context.previous);
      }
      addNotification({
        type: "error",
        message: "Failed to update todo group",
      });
    },

    onSettled: () => {
      client.invalidateQueries({ queryKey: ["todo-groups"] });
    },
  });

  return { mutate, ...props };
};

export const useGetTodoGroup = (id: string) => {
  return useQuery({
    queryKey: ["todo-groups", id],
    queryFn: () => findOne(id),
  });
};

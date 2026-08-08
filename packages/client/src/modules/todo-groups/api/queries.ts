import {
  useQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
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
  TTodoGroup,
} from "types";
import type { TCreateTodoGroupForm } from "../model/todo-group.dto";

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
      client.setQueryData<TTodoGroup[]>(["todo-groups"], (old) =>
        (old ?? [])
          .filter((el) => el.id !== context.temporaryId)
          .concat(todoGroup),
      );
    },
    onError: (_err, _dto, context) => {
      if (context.previousData) {
        client.setQueryData<TTodoGroup[]>(["todo-groups"], context.previousData);
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
  const client = useQueryClient();
  const { mutate, ...props } = useMutation({
    mutationFn: (data: TCreateTodoGroupBody) => {
      return updateOne(data, id);
    },
    mutationKey: ["todo-groups"],
    onSuccess: (newTodoGroup) => {
      addNotification({
        type: "success",
        message: "Todo group updated successfully",
      });
      client.setQueryData(["todo-groups"], () => newTodoGroup);
      client.setQueriesData<InfiniteData<IItemsResponse<TExtendedTodo>>>(
        { queryKey: ["todos"] },
        (old) => {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) => ({
                ...item,
                todoGroup: newTodoGroup,
              })),
            })),
          };
        },
      );
    },
    onMutate: async (newTodoGroup) => {
      await client.cancelQueries({
        queryKey: ["todo-groups"],
      });
      const previous = client.getQueryData<TTodoGroup>(["todo-groups"]);
      client.setQueryData<TTodoGroup>(["todo-groups"], () => ({
        ...newTodoGroup,
        id: crypto.randomUUID(),
      }));
      return { previous };
    },
    onError: (_err, _newTodoGroup, context) => {
      if (context?.previous) {
        client.setQueryData(
          ["todo-groups", context.previous.id],
          context.previous,
        );
      }
      addNotification({
        type: "error",
        message: "Failed to update todo group",
      });
    },
  });

  const handleSubmit = (dto: TCreateTodoGroupForm, cb?: () => void) => {
    mutate({ name: dto.name }, { onSuccess: cb });
  };
  return { mutate: handleSubmit, ...props };
};

export const useGetTodoGroup = (id: string) => {
  return useQuery({
    queryKey: ["todo-groups", id],
    queryFn: () => findOne(id),
  });
};

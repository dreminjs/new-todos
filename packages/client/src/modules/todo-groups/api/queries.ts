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
import { useSystemNotificationStore } from "../../notifications/model/notification.store";
import type {
  IItemsResponse,
  TCreateTodoGroup,
  TExtendedTodo,
  TTodoGroup,
} from "types";
import type {
  TCreateTodoGroupContext,
  TCreateTodoGroupForm,
} from "../model/todo-group.dto";

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
  const { mutate, isPending } = useMutation({
    mutationFn: (data: TTodoGroup) => createOne(data),
    onSuccess: () => {
      addNotification({
        type: "success",
        message: "Todo group created successfully",
      });
    },
    onError: () => {
      addNotification({
        type: "error",
        message: "Failed to create todo group",
      });
    },
    onMutate: (newTodoGroup) => {
      client.setQueryData<TTodoGroup[]>(["todo-groups"], (oldData) => [
        ...oldData,
        newTodoGroup,
      ]);
    },
  });

  return { mutate, isPending };
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

export const useUpdateTodoGroup = (dtoContext: TCreateTodoGroupContext) => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  const client = useQueryClient();
  const { mutate, ...props } = useMutation({
    mutationFn: (data: TCreateTodoGroup) => {
      return updateOne(data);
    },
    mutationKey: ["todo-groups", dtoContext.id],
    onSuccess: (newTodoGroup) => {
      addNotification({
        type: "success",
        message: "Todo group updated successfully",
      });
      client.setQueryData(["todo-groups", newTodoGroup.id], () => newTodoGroup);
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
      const previous = client.getQueryData<TTodoGroup>([
        "todo-groups",
        newTodoGroup.id,
      ]);
      client.setQueryData<TTodoGroup>(["todo-groups", newTodoGroup.id], () => ({
        ...newTodoGroup,
      }));
      return { previous };
    },
    onError: (err, _newTodoGroup, context) => {
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
    mutate(
      { name: dto.name, userId: dtoContext.userId, id: dtoContext.id },
      { onSuccess: cb },
    );
  };
  return { mutate: handleSubmit, ...props };
};

export const useGetTodoGroup = (id: string) => {
  return useQuery({
    queryKey: ["todo-groups", id],
    queryFn: () => findOne(id),
  });
};

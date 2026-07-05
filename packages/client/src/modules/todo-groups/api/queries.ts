import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  findGroups,
  createOne,
  updateOne,
  deleteOne,
  findOne,
} from "./service";
import { useNotificationStore } from "../../notifications/model/notification.store";
import type { TCreateTodoGroup } from "types";

export const useGetTodoGroups = () => {
  return useQuery({
    queryKey: ["todo-groups"],
    queryFn: findGroups,
  });
};

export const useCreateTodoGroup = () => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: TCreateTodoGroup) => createOne(data),
    onSuccess: () => {
      addNotification({
        type: "success",
        message: "Todo group created successfully",
      });
      client.invalidateQueries({
        queryKey: ["todo-groups"],
      });
    },
    onError: () => {
      addNotification({
        type: "error",
        message: "Failed to create todo group",
      });
    },
  });

  return { mutate, isPending };
};

export const useDeleteTodoGroup = () => {
  const addNotification = useNotificationStore(
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
      client.invalidateQueries({
        queryKey: ["todo-groups"],
      });
    },
    onError: () => {
      addNotification({
        type: "error",
        message: "Failed to delete todo group",
      });
    },
  });
};

export const useUpdateTodoGroup = (todoId: string) => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const client = useQueryClient();

  return useMutation({
    mutationFn: (data: TCreateTodoGroup) => updateOne(todoId, data),
    onSuccess: () => {
      addNotification({
        type: "success",
        message: "Todo group updated successfully",
      });
      client.invalidateQueries({
        queryKey: ["todo-groups"],
      });
      client.invalidateQueries({
        queryKey: ["todos"],
      });
    },
    onError: () => {
      addNotification({
        type: "error",
        message: "Failed to update todo group",
      });
    },
  });
};

export const useGetTodoGroup = (id: string) => {
  return useQuery({
    queryKey: ["todo-groups", id],
    queryFn: () => findOne(id),
  });
};

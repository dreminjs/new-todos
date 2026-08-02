import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  findMyNotifications,
  updateReadNotification,
  updateUnreadNotificaton,
} from "./services";
import type { TNotification, IItemsResponse } from "types";
import { useSystemNotificationStore } from "../../system-notifications/model/notification.store";

export const useGetMyNotifications = () => {
  return useInfiniteQuery<IItemsResponse<TNotification>>({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      findMyNotifications({
        cursor: pageParam as string | undefined,
        take: 20,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export const useUpdateReadNotification = () => {
  const queryClient = useQueryClient();
  const addNotification = useSystemNotificationStore(store => store.addNotification)
  return useMutation({
    mutationFn: updateReadNotification,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData<
        InfiniteData<IItemsResponse<TNotification>>
      >(["notifications"]);

      queryClient.setQueryData<InfiniteData<IItemsResponse<TNotification>>>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((el) =>
                el.id === id ? { ...el, read: true } : el,
              ),
            })),
          };
        },
      );

      return { previousNotifications };
    },
    onError: (err, id, context) => {
      addNotification({
        type: "error",
        message: "Failed to read notification"
      })
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
export const useUpdateUnreadNotification = () => {
  const queryClient = useQueryClient();
  const addNotification = useSystemNotificationStore(store => store.addNotification)

  return useMutation({
    mutationFn: updateUnreadNotificaton,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData<
        InfiniteData<IItemsResponse<TNotification>>
      >(["notifications"]);

      queryClient.setQueryData<InfiniteData<IItemsResponse<TNotification>>>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((el) =>
                el.id === id ? { ...el, read: false } : el,
              ),
            })),
          };
        },
      );

      return { previousNotifications };
    },
    onError: (err, id, context) => {
      addNotification({
        type: "error",
        message: "Failed to unread notification"
      })
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

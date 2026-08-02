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
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, ...args } =
    useInfiniteQuery<IItemsResponse<TNotification>>({
      queryKey: ["notifications"],
      queryFn: ({ pageParam }) =>
        findMyNotifications({
          cursor: pageParam as string | undefined,
          take: 20,
        }),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

  const items = data?.pages.flatMap((page) => page.items);

  const loadMoreRows = isFetchingNextPage
    ? () => Promise.resolve()
    : () => fetchNextPage();

  return {
    items,
    rowCount: hasNextPage ? items?.length + 1 : items?.length,
    loadMoreRows,
    hasNextPage,
    ...args,
  };
};

export const useUpdateReadNotification = () => {
  const queryClient = useQueryClient();
  const addNotification = useSystemNotificationStore(
    (store) => store.addNotification,
  );
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
        message: "Failed to read notification",
      });
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
    },
    onSuccess: (updatedNotification) => {
      queryClient.setQueryData<InfiniteData<IItemsResponse<TNotification>>>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((el) =>
                el.id === updatedNotification.id ? updatedNotification : el,
              ),
            })),
          };
        },
      );
    },
  });
};
export const useUpdateUnreadNotification = () => {
  const queryClient = useQueryClient();
  const addNotification = useSystemNotificationStore(
    (store) => store.addNotification,
  );

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
        message: "Failed to unread notification",
      });
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
    },
    onSuccess: (updatedNotification) => {
      queryClient.setQueryData<InfiniteData<IItemsResponse<TNotification>>>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((el) =>
                el.id === updatedNotification.id ? updatedNotification : el,
              ),
            })),
          };
        },
      );
    },
  });
};

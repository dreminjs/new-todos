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
import type { ToggleReadParams } from "../model/notification.model";
import { instance } from "../../../shared/api/api.instance";

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

const notificationAbortControllers = new Map<string, AbortController>();

export const useToggleNotificationRead = () => {
  const queryClient = useQueryClient();

  const { mutate, ...props } = useMutation({
    mutationFn: ({ id, read }: ToggleReadParams) => {
      notificationAbortControllers.get(id)?.abort();

      const controller = new AbortController();
      notificationAbortControllers.set(id, controller);

      return read
        ? updateReadNotification(id, controller.signal)
        : updateUnreadNotificaton(id, controller.signal);
    },

    onMutate: async ({ id, read }: ToggleReadParams) => {
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
                el.id === id ? { ...el, read } : el,
              ),
            })),
          };
        },
      );

      return { previousNotifications };
    },

    onError: (_, _data, context) => {
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

    onSettled: (_data, _err, { id }) => {
      notificationAbortControllers.delete(id);
    },
  });

  const handleMutate = (id: string, read: boolean) => {
    mutate({ id, read });
  };

  return { ...props, mutate: handleMutate };
};

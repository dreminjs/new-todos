import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  findMyNotifications,
  updateReadNotification,
  updateUnreadNotificaton,
} from "./services";
import type { TNotification } from "types";

export const useGetMyNotifications = () => {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      findMyNotifications({ cursor: pageParam, take: 10 }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export const useUpdateReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReadNotification,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      queryClient.setQueryData<TNotification[]>(["notifications"], (old) => {
        if (!old) return old;

        return old.map((el) => (el.id === id ? { ...el, read: true } : el));
      });
    },
    onError: (err, id, context) => {
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

  return useMutation({
    mutationFn: updateUnreadNotificaton,
    onMutate: (id) => {
      queryClient.setQueryData<TNotification[]>(["notifications"], (old) => {
        if (!old) return old;

        return old.map((el) => (el.id === id ? { ...el, read: false } : el));
      });
    },
  });
};

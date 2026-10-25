import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  findMe,
  getUsernameAvailabilty,
  removeAvatar,
  updateMe,
  uploadAvatar,
} from "./services";
import type { TUpdateUserDto, TUser, TUsernameQueryParams } from "types";
import { useSystemNotificationStore } from "../../system-notifications/model/notification.store";
export function useGetMe(): UseQueryResult<TUser>;
export function useGetMe<K extends keyof TUser>(
  keys: K,
): Omit<UseQueryResult<TUser>, "data"> & { data: TUser[K] | undefined };

export function useGetMe(keys?: keyof TUser): unknown {
  const { data, ...rest } = useQuery({
    queryKey: ["user", "me"],
    queryFn: findMe,
  });

  return { data: keys ? data?.[keys] : data, ...rest };
}

export const useUploadAvatar = ({ onSettled }: { onSettled: () => void }) => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["user", "upload-avatar"],
    mutationFn: uploadAvatar,
    onMutate: () => {
      onSettled();
      const previousData = client.getQueryData<TUser>(["user", "me"]);
      addNotification({ type: "info", message: "Avatar is uploading..." });
      return {
        previousData,
      };
    },
    onSuccess: (user) => {
      onSettled();
      client.setQueryData(["user", "me"], () => user);
      addNotification({ type: "success", message: "Avatar is uploaded!" });
    },
    onError: (_, _result, context) => {
      onSettled();
      client.setQueryData(["user", "me"], () => context.previousData);
      addNotification({
        type: "error",
        message: "Avatar uploading is error...",
      });
    },
  });
};

export const useRemoveAvatar = ({ onSettled }: { onSettled: () => void }) => {
  const client = useQueryClient();

  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );

  return useMutation({
    mutationKey: ["user", "remove-avatar"],
    mutationFn: removeAvatar,
    onMutate: () => {
      onSettled();
      const previousData = client.getQueryData<TUser>(["user", "me"]);
      addNotification({ type: "info", message: "Avatar is removing..." });
      return {
        previousData,
      };
    },
    onSuccess: (user) => {
      onSettled();
      client.setQueryData(["user", "me"], () => user);
      addNotification({ type: "success", message: "Avatar is removed!" });
    },
    onError: (_error, _result, context) => {
      onSettled();
      client.setQueryData(["user", "me"], () => context.previousData);
      addNotification({
        type: "error",
        message: "Avatar removing is error...",
      });
    },
  });
};

export const useUpdateMe = () => {
  const client = useQueryClient();
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );

  const previousData = client.getQueryData<TUser>(["user", "me"]);
  return useMutation({
    mutationFn: (dto: TUpdateUserDto) => updateMe(dto),
    onMutate: (dto) => {
      client.setQueryData<TUser>(["user", "me"], (user) => ({
        ...user,
        ...dto,
      }));

      addNotification({
        type: "info",
        message: "Current user info is updating",
      });

      return { previousData };
    },
    onSuccess: (updatedUser) => {
      addNotification({
        type: "success",
        message: "Current user info is updated",
      });
      client.setQueryData<TUser>(["user", "me"], () => updatedUser);
    },
    onError: (_dto, _vars, context) => {
      addNotification({
        type: "success",
        message: "something went wrong",
      });
      if (context.previousData) {
        client.setQueryData<TUser>(["user", "me"], () => context.previousData);
      }
    },
  });
};


export const useGetUsernameAvailability = ({
  username,
}: TUsernameQueryParams) => {
  return useQuery({
    queryKey: ["user", "username", "availability", username],
    queryFn: () => getUsernameAvailabilty({ username }),
    staleTime: 0,
  });
};

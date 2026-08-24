import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOne } from "./services";
import type { TChat, TCreateChatBodyDto } from "types";
import { useSystemNotificationStore } from "../../system-notifications/model/notification.store";

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  const { mutate, isPending } = useMutation({
    mutationFn: createOne,
    onMutate: (dto) => {
      const temporaryId = crypto.randomUUID();
      queryClient.setQueryData<TChat[]>(
        ["workspace", dto.workspaceId, "chats"],
        (chats) => [...chats, { ...dto, id: temporaryId }],
      );
      return { temporaryId };
    },
    onSuccess: (newChat, _dto, context) => {
      addNotification({
        type: "success",
        message: `Chat "${newChat.name}" has been created successfully.`,
      });
      queryClient.setQueryData<TChat[]>(
        ["workspace", newChat.workspaceId, "chats"],
        (chats) =>
          chats.map((chat) =>
            chat.id === context.temporaryId ? newChat : chat,
          ),
      );
    },
    onError: (_error, _dto, context) => {
      addNotification({
        type: "error",
        message: `Failed to create chat "${_dto.name}".`,
      });
      queryClient.setQueryData<TChat[]>(
        ["workspace", _dto.workspaceId, "chats"],
        (chats) => chats.filter((chat) => chat.id !== context.temporaryId),
      );
    },
  });

  const handleMutate = (
    dto: TCreateChatBodyDto,
    { onSuccess: onSuccessCallback }: { onSuccess: () => void },
  ) => {
    return mutate(dto, { onSuccess: onSuccessCallback });
  };

  return { mutate: handleMutate, isPending };
};

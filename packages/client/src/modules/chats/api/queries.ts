import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createMessage, createOne, getChatMessages } from "./services";
import type {
  TChat,
  TCreateChatBodyDto,
  TExtendedChatMessage,
  IItemsResponse,
} from "types";
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

export const useChatMessages = (chatId: string) => {
  return useInfiniteQuery<IItemsResponse<TExtendedChatMessage>>({
    queryKey: ["chats", chatId, "messages"],
    queryFn: ({ pageParam }) => getChatMessages(chatId, pageParam as string),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export const useCreateChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMessage,
    onSuccess: (newMessage) => {
      queryClient.setQueryData(
        ["chats", newMessage.chatId, "messages"],
        (old: { pages: IItemsResponse<TExtendedChatMessage>[]; pageParams: (string | undefined)[] } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page, i) =>
              i === 0
                ? { ...page, items: [newMessage, ...page.items] }
                : page,
            ),
          };
        },
      );
    },
  });
};

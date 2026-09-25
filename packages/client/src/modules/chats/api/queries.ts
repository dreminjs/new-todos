import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  createMessage,
  createOne,
  deleteMessageChat,
  editMessage,
  findWorkspaceChats,
  getChatMessages,
} from "./services";
import type {
  TChat,
  TCreateChatBodyDto,
  TExtendedChatMessage,
  IItemsResponse,
  TCreateChatContext,
  TCreateChatMessageBodyDto,
} from "types";
import { useSystemNotificationStore } from "../../system-notifications/model/notification.store";
import type { IChatContext, TEditMessageDto } from "../model/chats.types";
import { useChatStore } from "../model/chat.store";
import { useGetMe } from "../../users";
import { useClearReplyMessageId } from "../model/hooks/useClearReplyMessageId";
import { useGetCurrentEditMessage } from "../model/hooks/useGetCurrentEditMessage";
import { useCurrentWorkspace } from "../../workspaces/model/hooks/useCurrentWorkspace";

export const useCreateChat = (dtoContext: TCreateChatContext) => {
  const queryClient = useQueryClient();
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  const { mutate, isPending } = useMutation({
    mutationFn: (dto: TCreateChatBodyDto) => createOne(dto, dtoContext),
    onMutate: (dto) => {
      const temporaryId = crypto.randomUUID();
      queryClient.setQueryData<TChat[]>(
        ["workspaces", dtoContext.workspaceId, "chats"],
        (chats) => [
          ...chats,
          { ...dto, id: temporaryId, workspaceId: dtoContext.workspaceId },
        ],
      );
      return { temporaryId };
    },
    onSuccess: (newChat, _dto, context) => {
      addNotification({
        type: "success",
        message: `Chat "${newChat.name}" has been created successfully.`,
      });
      queryClient.setQueryData<TChat[]>(
        ["workspaces", newChat.workspaceId, "chats"],
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
        ["workspaces", dtoContext.workspaceId, "chats"],
        (chats) => {
          return chats.filter((chat) => chat.id !== context.temporaryId);
        },
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

export const useGetChatMessages = (chatId: string, workspaceId: string) => {
  return useInfiniteQuery<IItemsResponse<TExtendedChatMessage>>({
    queryKey: ["workspaces", workspaceId, "chats", chatId, "messages"],
    queryFn: ({ pageParam }) =>
      getChatMessages({ chatId, workspaceId }, pageParam as string),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export const useUpdateChatMessage = (dtoContext: IChatContext) => {
  const queryClient = useQueryClient();
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  const { mutate: handleMutate, isPending } = useMutation({
    mutationFn: (dto: TEditMessageDto) =>
      editMessage({ content: dto.content }, dto.id, dtoContext),
    onMutate: (dto) => {
      const originalData = queryClient.getQueryData<
        InfiniteData<IItemsResponse<TExtendedChatMessage>>
      >([
        "workspaces",
        dtoContext.workspaceId,
        "chats",
        dtoContext.chatId,
        "messages",
      ]);

      queryClient.setQueryData(
        [
          "workspaces",
          dtoContext.workspaceId,
          "chats",
          dtoContext.chatId,
          "messages",
        ],
        (
          old:
            | {
                pages: IItemsResponse<TExtendedChatMessage>[];
                pageParams: (string | undefined)[];
              }
            | undefined,
        ) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === dto.id ? { ...item, content: dto.content } : item,
              ),
            })),
          };
        },
      );

      return { originalData };
    },
    onSuccess: (newMessage, dto) => {
      queryClient.setQueryData(
        [
          "workspaces",
          dtoContext.workspaceId,
          "chats",
          dtoContext.chatId,
          "messages",
        ],
        (
          old:
            | {
                pages: IItemsResponse<TExtendedChatMessage>[];
                pageParams: (string | undefined)[];
              }
            | undefined,
        ) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === dto.id
                  ? {
                      ...item,
                      content: newMessage.content,
                      user: newMessage.user,
                    }
                  : item,
              ),
            })),
          };
        },
      );
    },
    onError: (error, _dto, context) => {
      addNotification({
        type: "error",
        message: error.message,
      });
      queryClient.setQueryData<
        InfiniteData<IItemsResponse<TExtendedChatMessage>>
      >(
        [
          "workspaces",
          dtoContext.workspaceId,
          "chats",
          dtoContext.chatId,
          "messages",
        ],
        (old) => {
          if (!old) return old;
          return context.originalData;
        },
      );
    },
  });

  return { mutate: handleMutate, isPending };
};

export const useCreateChatMessage = (dtoContext: IChatContext) => {
  const queryClient = useQueryClient();
  const replyMessageId = useChatStore((state) => state.replyMessageId);
  const clearReplyMessageId = useClearReplyMessageId();

  const currentWorkspace = useCurrentWorkspace();
  const currentUser = useGetMe();
  return useMutation({
    mutationFn: (dto: TCreateChatMessageBodyDto) =>
      createMessage({ ...dto, replyToId: replyMessageId }, dtoContext),
    onMutate: (dto) => {
      const temporaryId = crypto.randomUUID();

      queryClient.setQueryData<
        InfiniteData<IItemsResponse<TExtendedChatMessage>>
      >(
        [
          "workspaces",
          dtoContext.workspaceId,
          "chats",
          dtoContext.chatId,
          "messages",
        ],
        (old) => {
          if (!old) return old;

          const optimisticMessage: TExtendedChatMessage = {
            ...dto,
            id: temporaryId,
            chatId: dtoContext.chatId,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: currentUser.data,
            workspace: {
              name: currentWorkspace.workspaceInfo.name,
              description: currentWorkspace.workspaceInfo.description,
              id: currentWorkspace.workspaceInfo.id,
              ownerId: currentWorkspace.workspaceInfo.ownerId,
            },
          };
          if (old.pages.length === 0)
            return {
              ...old,
              pages: [
                {
                  ...old.pages[0],
                  items: [optimisticMessage],
                },
              ],
            };
          const firstPage = old.pages[0];
          const restPages = old.pages.slice(1);

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                items: [optimisticMessage, ...firstPage.items],
              },
              ...restPages,
            ],
          };
        },
      );

      return { temporaryId };
    },
    onSuccess: (newMessage, _dto, context) => {
      clearReplyMessageId();

      queryClient.setQueryData<
        InfiniteData<IItemsResponse<TExtendedChatMessage>>
      >(
        [
          "workspaces",
          dtoContext.workspaceId,
          "chats",
          dtoContext.chatId,
          "messages",
        ],
        (old) => {
          if (!old) return old;

          const pages = old.pages.map((page) => ({
            ...page,
            items: page.items
              .filter((el) => el.id !== newMessage.id)
              .map((msg) =>
                msg.id === context.temporaryId ? newMessage : msg,
              ),
          }));
          return { ...old, pages };
        },
      );
    },
  });
};

export const useGetWorkspaceChats = (workspaceId: string) => {
  return useQuery({
    queryFn: () => findWorkspaceChats(workspaceId),
    queryKey: ["workspaces", workspaceId, "chats"],
  });
};

export const useDeleteChatMessage = (dtoContext: IChatContext) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatMessageId: string) =>
      deleteMessageChat(chatMessageId, dtoContext),
    onSuccess: (chatMessage: TExtendedChatMessage) => {
      queryClient.setQueryData<
        InfiniteData<IItemsResponse<TExtendedChatMessage>>
      >(
        [
          "workspaces",
          dtoContext.workspaceId,
          "chats",
          dtoContext.chatId,
          "messages",
        ],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((msg) => msg.id !== chatMessage.id),
            })),
          };
        },
      );
    },
    onMutate: (chatMessageId: string) => {
      const previousData = queryClient.getQueryData<
        InfiniteData<IItemsResponse<TExtendedChatMessage>>
      >([
        "workspaces",
        dtoContext.workspaceId,
        "chats",
        dtoContext.chatId,
        "messages",
      ]);

      queryClient.setQueryData<
        InfiniteData<IItemsResponse<TExtendedChatMessage>>
      >(
        [
          "workspaces",
          dtoContext.workspaceId,
          "chats",
          dtoContext.chatId,
          "messages",
        ],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((msg) => msg.id !== chatMessageId),
            })),
          };
        },
      );

      return {
        previousData,
      };
    },
    onError: (_err, _dto, context) => {
      queryClient.setQueryData<
        InfiniteData<IItemsResponse<TExtendedChatMessage>>
      >(
        [
          "workspaces",
          dtoContext.workspaceId,
          "chats",
          dtoContext.chatId,
          "messages",
        ],
        (old) => {
          if (!old) return old;
          return context.previousData;
        },
      );
    },
  });
};

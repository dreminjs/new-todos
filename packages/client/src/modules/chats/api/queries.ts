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
import type { IChatContext } from "../model/chats.types";

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
      console.log(_error);
      addNotification({
        type: "error",
        message: `Failed to create chat "${_dto.name}".`,
      });
      queryClient.setQueryData<TChat[]>(
        ["workspaces", dtoContext.workspaceId, "chats"],
        (chats) => {
          console.log(chats);

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

export const useCreateChatMessage = (dtoContext: IChatContext) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: TCreateChatMessageBodyDto) =>
      createMessage(dto, dtoContext),
    onSuccess: (newMessage) => {
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
        (
          old:
            | {
                pages: IItemsResponse<TExtendedChatMessage>[];
                pageParams: (string | undefined)[];
              }
            | undefined,
        ) => {
          if (!old) return old;
          const alreadyExists = old.pages.some((page) =>
            page.items.some((msg) => msg.id === newMessage.id),
          );
          if (alreadyExists) return old;

          const lastPage = old.pages[old.pages.length - 1];
          const restPages = old.pages.slice(0, -1);
          return {
            ...old,
            pages: [
              ...restPages,
              {
                ...lastPage,
                items: [...lastPage.items, newMessage],
              },
            ],
          };
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

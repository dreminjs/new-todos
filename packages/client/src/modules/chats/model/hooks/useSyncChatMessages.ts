import { useEffect } from "react";
import { useSocket } from "../../../../app/model/useSocket";
import type {
  IItemsResponse,
  IWsChatMessageDeletedPayload,
  TExtendedChatMessage,
} from "types";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type { IChatContext } from "../chats.types";

const getChatMessagesQueryKey = (workspaceId: string, chatId: string) =>
  ["workspaces", workspaceId, "chats", chatId, "messages"] as const;

export const useSyncChatMessages = (dtoContext: IChatContext) => {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !dtoContext.chatId) return;

    const queryKey = getChatMessagesQueryKey(
      dtoContext.workspaceId,
      dtoContext.chatId,
    );

    type TCache = InfiniteData<IItemsResponse<TExtendedChatMessage>>;

    const updatePages = (
      updater: (
        page: IItemsResponse<TExtendedChatMessage>,
      ) => IItemsResponse<TExtendedChatMessage>,
    ) => {
      queryClient.setQueryData<TCache>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, pages: old.pages.map(updater) };
      });
    };

    const onReceive = (newMessage: TExtendedChatMessage) => {
      queryClient.setQueryData<TCache>(queryKey, (old) => {
        if (!old) return old;

        const alreadyExists = old.pages.some((page) =>
          page.items.some((msg) => msg.id === newMessage.id),
        );
        if (alreadyExists) return old;

        const lastPage = old.pages[old.pages.length - 1];
        const restPages = old.pages.slice(0, -1);

        if (!lastPage) {
          return {
            ...old,
            pages: [{ items: [newMessage], nextCursor: undefined }],
          };
        }

        return {
          ...old,
          pages: [
            ...restPages,
            { ...lastPage, items: [...lastPage.items, newMessage] },
          ],
        };
      });
    };

    const onDelete = (dto: IWsChatMessageDeletedPayload) => {
      updatePages((page) => ({
        ...page,
        items: page.items.filter((msg) => msg.id !== dto.chatMessageId),
      }));
    };

    const onEdit = (newMessage: TExtendedChatMessage) => {
      updatePages((page) => ({
        ...page,
        items: page.items.map((msg) =>
          msg.id === newMessage.id ? newMessage : msg,
        ),
      }));
    };

    socket.emit("join-chat-room", { id: dtoContext.chatId });
    socket.on("chat-messages:recieve", onReceive);
    socket.on("chat-messages:delete", onDelete);
    socket.on("chat-messages:edit", onEdit);

    return () => {
      socket.off("chat-messages:recieve", onReceive);
      socket.off("chat-messages:delete", onDelete);
      socket.off("chat-messages:edit", onEdit);
      socket.emit("leave-chat-room", { id: dtoContext.chatId });
    };
  }, [socket, dtoContext.chatId, dtoContext.workspaceId, queryClient]);

  if (!dtoContext.chatId) return null;
};

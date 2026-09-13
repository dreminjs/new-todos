import { useEffect } from "react";
import { useSocket } from "../../../../app/model/useSocket";
import type {
  IItemsResponse,
  IWsChatMessageDeletedPayload,
  TExtendedChatMessage,
} from "types";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type { IChatContext } from "../chats.types";

export const useSyncChatMessages = (dtoContext: IChatContext) => {
  const queryClient = useQueryClient();

  const socket = useSocket();

  useEffect(() => {
    if (!socket || !dtoContext.chatId) return;

    socket.emit("join-chat-room", { id: dtoContext.chatId });

    socket.on("chat-messages:recieve", (newMessage: TExtendedChatMessage) => {
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
    });

    socket.on("chat-messages:delete", (dto: IWsChatMessageDeletedPayload) => {
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
          const updatedPages = old.pages.map((page) => ({
            ...page,
            items: page.items.filter((msg) => msg.id !== dto.chatMessageId),
          }));
          return {
            ...old,
            pages: updatedPages,
          };
        },
      );
    });

    return () => {
      socket.emit("leave-chat-room", { id: dtoContext.chatId });
    };
  }, [socket, dtoContext.chatId, dtoContext.workspaceId]);

  if (!dtoContext.chatId) return null;
};

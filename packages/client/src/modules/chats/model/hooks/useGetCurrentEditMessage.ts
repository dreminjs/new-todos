import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useChatStore } from "../chat.store";
import type { IItemsResponse, TExtendedChatMessage } from "types";
import type { IChatContext } from "../chats.types";

export const useGetCurrentEditMessage = ({
  workspaceId,
  chatId,
}: IChatContext): TExtendedChatMessage | null => {
  const queryClient = useQueryClient();
  const editMessageId = useChatStore((state) => state.editMessageId);
  if (!editMessageId) return null;
  const messages = queryClient.getQueryData<
    InfiniteData<IItemsResponse<TExtendedChatMessage>>
  >(["workspaces", workspaceId, "chats", chatId, "messages"]);
  if (!messages) return null;

  console.log({ messages, editMessageId });

  const editMessage = messages?.pages
    ?.find((el) => el.items.find((el) => el.id === editMessageId))
    ?.items.find((el) => el.id === editMessageId);

  return editMessage;
};

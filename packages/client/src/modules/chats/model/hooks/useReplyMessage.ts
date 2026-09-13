import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useChatStore } from "../chat.store";
import type { IChatContext } from "../chats.types";
import type { IItemsResponse, TExtendedChatMessage } from "types";

export const useReplyMessage = ({
  workspaceId,
  chatId,
}: IChatContext): TExtendedChatMessage | null => {
  const queryClient = useQueryClient();
  const replyMessageId = useChatStore((state) => state.replyMessageId);
  if (!replyMessageId) return null;
  const messages = queryClient.getQueryData<
    InfiniteData<IItemsResponse<TExtendedChatMessage>>
  >(["workspaces", workspaceId, "chats", chatId, "messages"]);

  const repliedMessage = messages?.pages
    .find((el) => el.items.find((el) => el.id === replyMessageId))
    ?.items.find((el) => el.id === replyMessageId);

  return repliedMessage;
};

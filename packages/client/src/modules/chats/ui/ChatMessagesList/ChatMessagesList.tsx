import type { FC } from "react";
import { useGetChatMessages } from "../../api/queries";
import { ChatMessagesListItem } from "../ChatMessagesListItem/ChatMessagesListItem";
import styles from "./ChatMessagesList.module.css";
import { useGetMe } from "../../../users";
import type { IChatContext } from "../../model/chats.types";
import { useOnInView } from "react-intersection-observer";
import { useChatMessageSelection } from "../../model/hooks/useChatMessageSelection";
import { useChatScrollBehavior } from "../../model/hooks/useChatScrollBehavior";
import { format, isSameDay } from "date-fns";

type TChatMessagesListProps = IChatContext;

export const ChatMessagesList: FC<TChatMessagesListProps> = ({
  chatId,
  workspaceId,
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetChatMessages(chatId, workspaceId);
  const messages = data?.pages.flatMap((page) => page.items).reverse() ?? [];

  const currentUserId = useGetMe("id").data;

  const { chatMessageId, chooseMessageId, closeManagementMenu } =
    useChatMessageSelection();

  const {
    containerRef,
    bottomRef,
    markPaginationStart,
    isFetchingNextPageAllowed,
  } = useChatScrollBehavior({ itemsCount: messages.length });

  const inViewRef = useOnInView(
    (inView) => {
      if (
        inView &&
        hasNextPage &&
        !isFetchingNextPage &&
        isFetchingNextPageAllowed()
      ) {
        markPaginationStart();
        fetchNextPage();
      }
    },
    { scrollMargin: "250px" },
  );

  if (isLoading) {
    return <div className={styles.loading}>Loading messages...</div>;
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.list}>
        <div style={{ height: 1 }} ref={inViewRef} />
        {messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : null;
          const isFirstInGroup =
            !previousMessage || previousMessage.user?.id !== message.user?.id;
          
          const showDateDivider =
            !previousMessage ||
            !isSameDay(new Date(message.createdAt), new Date(previousMessage.createdAt));

          return (
            <div key={message.id} className={styles.messageWrapper}>
              {showDateDivider && (
                <div className={styles.dateDivider}>
                  <span>{format(new Date(message.createdAt), "MMMM d, yyyy")}</span>
                </div>
              )}
              <ChatMessagesListItem
                message={message}
                isMine={currentUserId === message.user?.id}
                isFirstInGroup={isFirstInGroup}
                currentChoosedChatMessageId={chatMessageId}
                onCloseManagementMenu={closeManagementMenu}
                onChooseChatMessageId={chooseMessageId}
              />
            </div>
          );
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

import type { FC } from "react";
import { useGetChatMessages } from "../../api/queries";
import { ChatMessagesListItem } from "../ChatMessagesListItem/ChatMessagesListItem";
import styles from "./ChatMessagesList.module.css";
import { useGetMe } from "../../../users";
import type { IChatContext } from "../../model/chats.types";
import { useOnInView } from "react-intersection-observer";
import { useChatMessageSelection } from "../../model/hooks/useChatMessageSelection";
import { useChatScrollBehavior } from "../../model/hooks/useChatScrollBehavior";

type TChatMessagesListProps = IChatContext;

export const ChatMessagesList: FC<TChatMessagesListProps> = ({
  chatId,
  workspaceId,
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetChatMessages(chatId, workspaceId);
  const messages = data?.pages.flatMap((page) => page.items) ?? [];

  const currentUserId = useGetMe("id").data;

  const { chatMessageId, chooseMessageId, closeManagementMenu } =
    useChatMessageSelection();

  const { containerRef, bottomRef, markPaginationStart } =
    useChatScrollBehavior({ itemsCount: messages.length });

  const inViewRef = useOnInView(
    (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        markPaginationStart();
        fetchNextPage();
      }
    },
    { scrollMargin: "250px" },
  );

  console.log({ messages });

  if (isLoading) {
    return <div className={styles.loading}>Loading messages...</div>;
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <ul className={styles.list}>
        <li style={{ height: 1 }} ref={inViewRef} />
        {messages.map((message) => (
          <ChatMessagesListItem
            key={message.id}
            message={message}
            isMine={currentUserId === message.user.id}
            currentChoosedChatMessageId={chatMessageId}
            onCloseManagementMenu={closeManagementMenu}
            onChooseChatMessageId={chooseMessageId}
          />
        ))}
      </ul>
      <div ref={bottomRef} />
    </div>
  );
};

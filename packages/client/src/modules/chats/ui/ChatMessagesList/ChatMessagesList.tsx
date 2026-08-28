import { useEffect, useRef } from "react";
import type { FC } from "react";
import { useChatMessages } from "../../api/queries";
import { ChatMessagesListItem } from "../ChatMessagesListItem/ChatMessagesListItem";
import styles from "./ChatMessagesList.module.css";
import { useGetMe } from "../../../users";

interface IChatMessagesListProps {
  chatId: string;
}

export const ChatMessagesList: FC<IChatMessagesListProps> = ({ chatId }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useChatMessages(chatId);
  const currentUserId = useGetMe("id").data;
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const messages = data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (isLoading) {
    return <div className={styles.loading}>Loading messages...</div>;
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {hasNextPage && (
        <button
          className={styles.loadMore}
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading..." : "Load older messages"}
        </button>
      )}
      <ul className={styles.list}>
        {messages.map((message) => (
          <ChatMessagesListItem
            key={message.id}
            message={message}
            isMine={currentUserId === message.user.id}
          />
        ))}
      </ul>
      <div ref={bottomRef} />
    </div>
  );
};

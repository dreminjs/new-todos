import { useEffect, useLayoutEffect, useRef } from "react";
import type { FC } from "react";
import { useGetChatMessages } from "../../api/queries";
import { ChatMessagesListItem } from "../ChatMessagesListItem/ChatMessagesListItem";
import styles from "./ChatMessagesList.module.css";
import { useGetMe } from "../../../users";
import type { IChatContext } from "../../model/chats.types";
import { useOnInView } from "react-intersection-observer";

type TChatMessagesListProps = IChatContext;

export const ChatMessagesList: FC<TChatMessagesListProps> = ({
  chatId,
  workspaceId,
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
     useGetChatMessages(chatId, workspaceId);
   const currentUserId = useGetMe("id").data;
   const bottomRef = useRef<HTMLDivElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const isPaginatingRef = useRef(false);
   const prevScrollHeightRef = useRef(0);
   const isNearBottomRef = useRef(true);

   const NEAR_BOTTOM_THRESHOLD = 150; // px

   const messages = data?.pages.flatMap((page) => page.items) ?? [];

   const inViewRef = useOnInView(
     (inView) => {
       if (inView && hasNextPage && !isFetchingNextPage) {
         isPaginatingRef.current = true;
         if (containerRef.current) {
           prevScrollHeightRef.current = containerRef.current.scrollHeight;
         }
         fetchNextPage();
       }
     },
     { scrollMargin: "250px" },
   );

   useEffect(() => {
     const container = containerRef.current;
     if (!container) return;

     const handleScroll = () => {
       const distanceFromBottom =
         container.scrollHeight - container.scrollTop - container.clientHeight;
       isNearBottomRef.current = distanceFromBottom < NEAR_BOTTOM_THRESHOLD;
     };

     handleScroll();
     container.addEventListener("scroll", handleScroll);
     return () => container.removeEventListener("scroll", handleScroll);
   }, []);

   useLayoutEffect(() => {
     const container = containerRef.current;
     if (!container) return;

     if (isPaginatingRef.current) {
       const diff = container.scrollHeight - prevScrollHeightRef.current;
       container.scrollTop += diff;
       isPaginatingRef.current = false;
       return;
     }

     if (isNearBottomRef.current) {
       bottomRef.current?.scrollIntoView({ behavior: "auto" });
     }
   }, [messages.length]);

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
          />
        ))}
      </ul>
      <div ref={bottomRef} />
    </div>
  );
};

import { useRef, type FC } from "react";
import { useMessageInteraction } from "../../../../shared/model/hooks/useMessageInteraction";
import { ChatMessageListItemManagement } from "./ChatMessageListItemManagement";
import { Menu } from "@chakra-ui/react";
import { ChatMessageListItemReplyMessage } from "./ChatMessagesListItemReplyMessage";
import type { TExtendedChatMessage } from "types";
import clsx from "clsx";
import styles from "./ChatMessagesListItem.module.css";
import { format } from "date-fns";

interface IChatMessagesListItemProps {
  message: TExtendedChatMessage;
  isMine: boolean;
  isFirstInGroup?: boolean;
  currentChoosedChatMessageId: string | null;
  onCloseManagementMenu: () => void;
  onChooseChatMessageId: (chatMessageId: string) => void;
}

export const ChatMessagesListItem: FC<IChatMessagesListItemProps> = ({
  message,
  isMine,
  isFirstInGroup = true,
  currentChoosedChatMessageId,
  onCloseManagementMenu,
  onChooseChatMessageId,
}) => {
  const user = message.user;
  const messageId = message.id;
  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : "Unknown user";
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "?";
  
  const time = format(new Date(message.createdAt), "HH:mm");

  const itemRef = useRef<HTMLDivElement>(null);
  const handlers = useMessageInteraction({
    onClick: () => {
      onChooseChatMessageId(messageId);
    },
    onLongPress: () => {
      onChooseChatMessageId(messageId);
    },
  });

  return (
    <Menu.Root
      open={currentChoosedChatMessageId === messageId}
      onOpenChange={(details) => {
        if (!details.open) onCloseManagementMenu();
      }}
      positioning={{
        strategy: "fixed",
        getAnchorRect: () => itemRef.current?.getBoundingClientRect() ?? null,
        placement: isMine ? "bottom-end" : "bottom-start",
        gutter: 4,
      }}
    >
      <div
        ref={itemRef}
        onContextMenu={(e) => {
          e.preventDefault();
          onChooseChatMessageId(messageId);
        }}
        className={clsx(
          styles.messageRow, 
          isMine ? styles.messageRowMine : styles.messageRowOther,
          !isFirstInGroup && styles.messageRowGrouped
        )}
        {...(isMine && handlers)}
      >
        {!isMine && (
          <div className={styles.avatarWrapper}>
            {isFirstInGroup && (
              <div className={styles.avatar}>
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={displayName}
                    className={styles.avatarImg}
                  />
                ) : (
                  <span className={styles.avatarFallback}>{initials}</span>
                )}
              </div>
            )}
          </div>
        )}

        <div className={clsx(styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther)}>
          {/* Имя показываем только для чужих сообщений и только если это первое сообщение в группе */}
          {!isMine && isFirstInGroup && (
            <div className={styles.senderName}>{displayName}</div>
          )}

          {message.replyTo && (
            <div className={styles.replyWrapper}>
              <ChatMessageListItemReplyMessage
                message={message.replyTo.content}
                repliedUser={message.replyTo.user}
              />
            </div>
          )}

          <div className={styles.contentWrapper}>
            <p className={styles.content}>{message.content}</p>
            <span className={styles.timestamp}>{time}</span>
          </div>
        </div>
      </div>
      
      <ChatMessageListItemManagement isMine={isMine} messageId={messageId} />
    </Menu.Root>
  );
};

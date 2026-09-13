import { useRef, type FC } from "react";
import type { TExtendedChatMessage } from "types";
import styles from "./ChatMessagesListItem.module.css";
import clsx from "clsx";
import { useMessageInteraction } from "../../../../shared/model/hooks/useMessageInteraction";
import { ChatMessageListItemManagement } from "./ChatMessageListItemManagement";
import { Menu } from "@chakra-ui/react";
import { ChatMessageListItemReply } from "./ChatMessagesListItemRepleMessage";

interface IChatMessagesListItemProps {
  message: TExtendedChatMessage;
  isMine: boolean;
  currentChoosedChatMessageId: string | null;
  onCloseManagementMenu: () => void;
  onChooseChatMessageId: (chatMessageId: string) => void;
  onSetReplyId: (chatMessageId: string) => void;
  onSetEditMessageId: (chatMessageId: string) => void;
}

export const ChatMessagesListItem: FC<IChatMessagesListItemProps> = ({
  message,
  isMine,
  currentChoosedChatMessageId,
  onCloseManagementMenu,
  onChooseChatMessageId,
  onSetReplyId,
  onSetEditMessageId,
}) => {
  const user = message.user;
  const messageId = message.id;
  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : "Unknown user";
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "?";
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const itemRef = useRef<HTMLLIElement>(null);
  const handlers = useMessageInteraction({
    onClick: () => {
      onChooseChatMessageId(messageId);
    },
    onLongPress: () => {
      onChooseChatMessageId(messageId);
    },
  });

  return (
    <>
      <Menu.Root
        open={currentChoosedChatMessageId === messageId}
        onOpenChange={(details) => {
          if (!details.open) onCloseManagementMenu();
        }}
        positioning={{
          strategy: "fixed",
          getAnchorRect: () => itemRef.current?.getBoundingClientRect() ?? null,
          placement: "bottom-start",
          gutter: 4,
        }}
      >
        <li
          ref={itemRef}
          onContextMenu={(e) => {
            e.preventDefault();
            onChooseChatMessageId(messageId);
          }}
          className={clsx(styles.messageItem, isMine && styles.mineMessage)}
          {...(isMine && handlers)}
        >
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
          <div className={styles.body}>
            <header className={styles.header}>
              <span className={styles.userName}>
                {isMine ? "You" : displayName}
              </span>
              <span className={styles.timestamp}>{time}</span>
            </header>
            {message.replyTo && (
              <ChatMessageListItemReply
                message={message.replyTo.content}
                repliedUser={message.replyTo.user}
              />
            )}
            <p className={styles.content}>{message.content}</p>
          </div>
        </li>
        <ChatMessageListItemManagement isMine={isMine} messageId={messageId} />
      </Menu.Root>
    </>
  );
};

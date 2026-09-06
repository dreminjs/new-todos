import type { FC } from "react";
import type { TExtendedChatMessage } from "types";
import styles from "./ChatMessagesListItem.module.css";
import clsx from "clsx";

interface IChatMessagesListItemProps {
  message: TExtendedChatMessage;
  isMine: boolean;
}

export const ChatMessagesListItem: FC<IChatMessagesListItemProps> = ({
  message,
  isMine,
}) => {
  const user = message.user;
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

  return (
    <li className={clsx(styles.messageItem, isMine && styles.mineMessage)}>
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
        <div className={styles.header}>
          <span className={styles.userName}>{isMine ? "You" : displayName}</span>
          <span className={styles.timestamp}>{time}</span>
        </div>
        <p className={styles.content}>{message.content}</p>
      </div>
    </li>
  );
};

import type { FC } from "react";
import type { TUser } from "types";
import styles from "./ChatMessagesListItem.module.css";

interface IChatMessageListItemReplyProps {
  message: string;
  repliedUser: TUser;
}

export const ChatMessageListItemReply: FC<IChatMessageListItemReplyProps> = ({
  message,
  repliedUser,
}) => {
  const authorName = repliedUser
    ? `${repliedUser.firstName} ${repliedUser.lastName}`
    : "Пользователь удалён";

  return (
    <div className={styles.ChatMessageListItemReply}>
      <span className={styles.replyAuthor}>{authorName}</span>
      <p className={styles.replyContent}>{message}</p>
    </div>
  );
};

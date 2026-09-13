import type { FC } from "react";
import { useReplyMessage } from "../../../model/hooks/useReplyMessage";
import { useParams } from "react-router";
import { RemoveReplyMessage } from "./RemoveReplyMessage";
import styles from "./ChatReplyMessage.module.css";

export const ChatReplyMessage: FC = () => {
  const { chatId, workspaceId } = useParams<{
    chatId: string;
    workspaceId: string;
  }>();

  const replyMessage = useReplyMessage({ chatId, workspaceId });


  if (!replyMessage) return null;

  return (
    <div className={styles.chatReplyMessage}>
      <div>
        <h3>
          {`Reply to ${replyMessage.user.firstName} ${replyMessage.user.lastName}`}
        </h3>
        {replyMessage.content}
      </div>
      <RemoveReplyMessage />
    </div>
  );
};

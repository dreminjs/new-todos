import { type FC } from "react";
import styles from "./ChatEditMessage.module.css";
import { LuPencil } from "react-icons/lu";
import { useParams } from "react-router";
import { RemoveEditMessage } from "./RemoveEditMessage";
import { useGetCurrentEditMessage } from "../../../model/hooks/useGetCurrentEditMessage";

export const ChatEditMessage: FC = () => {
  const { chatId, workspaceId } = useParams<{
    chatId: string;
    workspaceId: string;
  }>();

  const editMessage = useGetCurrentEditMessage({ chatId, workspaceId });

  if (!editMessage) return null;

  return (
    <div className={styles.chatEditMessage}>
      <div className={styles.chatEditMessageInner}>
        <LuPencil height={20} width={20} />
        <div>
          <p>Edit Message</p>
          <p>{editMessage.content}</p>
        </div>
      </div>
      <RemoveEditMessage />
    </div>
  );
};

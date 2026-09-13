import type { FC } from "react";
import { useParams } from "react-router";
import { ChatMessagesList } from "../ChatMessagesList/ChatMessagesList";
import { useSyncChatMessages } from "../../model/hooks/useSyncChatMessages";
import { ChatHeader } from "../ChatHeader/ChatHeader";
import { ChatBottom } from "../ChatBottom/ChatBottom";
import styles from "./Chat.module.css";

export const Chat: FC = () => {
  const { chatId, workspaceId } = useParams<{
    chatId: string;
    workspaceId: string;
  }>();
  useSyncChatMessages({ chatId, workspaceId });
  return (
    <div className={styles.chat}>
      <ChatHeader />
      <ChatMessagesList chatId={chatId} workspaceId={workspaceId} />
      <ChatBottom />
    </div>
  );
};

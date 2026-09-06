import type { FC } from "react";
import { useParams } from "react-router";
import { ChatInput } from "../ChatInput/ChatInput";
import { ChatMessagesList } from "../ChatMessagesList/ChatMessagesList";
import styles from "./Chat.module.css";
import { useSyncChatMessages } from "../../model/useSyncChatMessages";
import { ChatHeader } from "../ChatHeader/ChatHeader";

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
      <ChatInput workspaceId={workspaceId} chatId={chatId} />
    </div>
  );
};

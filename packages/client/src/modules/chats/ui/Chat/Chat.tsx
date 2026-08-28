import { useEffect } from "react";
import type { FC } from "react";
import { useParams } from "react-router";
import { useSocket } from "../../../../app/model/useSocket";
import { ChatInput } from "../ChatInput/ChatInput";
import { ChatMessagesList } from "../ChatMessagesList/ChatMessagesList";
import styles from "./Chat.module.css";

export const Chat: FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("join-chat-room", { id: chatId });

    return () => {
      socket.emit("leave-chat-room", { id: chatId });
    };
  }, [socket, chatId]);

  if (!chatId) return null;

  return (
    <div className={styles.chat}>
      <ChatMessagesList chatId={chatId} />
      <ChatInput chatId={chatId} />
    </div>
  );
};

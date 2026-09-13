import { useState, type KeyboardEvent } from "react";
import { useCreateChatMessage } from "../../../api/queries";
import styles from "./ChatInput.module.css";
import { useParams } from "react-router";

export const ChatInput = () => {
  const { chatId, workspaceId } = useParams<{
    chatId: string;
    workspaceId: string;
  }>();

  const [content, setContent] = useState("");
  const { mutate, isPending } = useCreateChatMessage({ chatId, workspaceId });

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed || isPending) return;

    mutate(
      { content: trimmed },
      { onSettled: () => setContent("") },
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.wrapper}>
      <textarea
        className={styles.input}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
      />
      <button
        className={styles.sendButton}
        onClick={handleSend}
        disabled={!content.trim() || isPending}
      >
        Send
      </button>
    </div>
  );
};

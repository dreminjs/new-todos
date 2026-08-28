import { useState, type KeyboardEvent } from "react";
import type { FC } from "react";
import { useCreateChatMessage } from "../../api/queries";
import styles from "./ChatInput.module.css";

interface IChatInputProps {
  chatId: string;
}

export const ChatInput: FC<IChatInputProps> = ({ chatId }) => {
  const [content, setContent] = useState("");
  const { mutate, isPending } = useCreateChatMessage();

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed || isPending) return;

    mutate(
      { content: trimmed, chatId },
      { onSuccess: () => setContent("") },
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

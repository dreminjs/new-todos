import { useState, type KeyboardEvent } from "react";
import type { FC } from "react";
import { useCreateChatMessage } from "../../api/queries";
import styles from "./ChatInput.module.css";
import type { IChatContext } from "../../model/chats.types";

type TChatInputProps = IChatContext;

export const ChatInput: FC<TChatInputProps> = (props) => {
  const [content, setContent] = useState("");
  const { mutate, isPending } = useCreateChatMessage(props);

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed || isPending) return;

    mutate({ content: trimmed }, { onSuccess: () => setContent("") });
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

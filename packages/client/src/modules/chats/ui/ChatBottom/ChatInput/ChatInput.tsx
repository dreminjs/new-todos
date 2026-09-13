import { useState, type FC, type KeyboardEvent } from "react";
import {
  useCreateChatMessage,
  useUpdateChatMessage,
} from "../../../api/queries";
import styles from "./ChatInput.module.css";
import { useParams } from "react-router";
import { useChatStore } from "../../../model/chat.store";

interface IChatInputProps {
  initialContent: string;
}

export const ChatInput: FC<IChatInputProps> = ({ initialContent }) => {
  const { chatId, workspaceId } = useParams<{
    chatId: string;
    workspaceId: string;
  }>();

  const [content, setContent] = useState(initialContent);
  const { mutate: createMessage, isPending: isPendingCreateMessage } =
    useCreateChatMessage({ chatId, workspaceId });
  const { mutate: updateMessage, isPending: isPendingUpdateMessage } =
    useUpdateChatMessage({ chatId, workspaceId });
  const editMessageId = useChatStore((state) => state.editMessageId);
  const setEditMessageId = useChatStore((state) => state.onSetEditMessageId);
  const isPending = isPendingCreateMessage || isPendingUpdateMessage;
  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed || isPending) return;

    if (editMessageId) {
      updateMessage(
        { content: trimmed, id: editMessageId },
        {
          onSettled: () => {
            setContent("");
            setEditMessageId(null);
          },
        },
      );
    } else {
      createMessage({ content: trimmed }, { onSettled: () => setContent("") });
    }
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
        disabled={!content?.trim() || isPending}
      >
        Send
      </button>
    </div>
  );
};

import { useRef, type FC } from "react";
import { FilesList } from "./FilesList";
import { useChatMessage } from "../../../model/hooks/useChatMessage";
import styles from "./ChatInput.module.css";

interface IChatInputProps {
  initialContent: string;
}

export const ChatInput: FC<IChatInputProps> = ({ initialContent }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    onSubmit,
    files,
    isSubmitDisabled,
    onRemoveFile,
    handleSubmit,
    onAddFiles,
    register,
    onKeyDown,
  } = useChatMessage(fileInputRef, initialContent);

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <FilesList files={files} onRemove={onRemoveFile} />

      <div className={styles.inputContainer}>
        <button
          type="button"
          className={styles.attachButton}
          onClick={() => {
            fileInputRef.current?.click();
          }}
          disabled={isSubmitDisabled}
        >
          📎
        </button>
        <input
          type="file"
          multiple
          hidden
          ref={fileInputRef}
          onChange={(e) => onAddFiles(e.target.files)}
        />
        <textarea
          {...register("content")}
          className={styles.input}
          onKeyDown={onKeyDown}
          placeholder="Type a message..."
          rows={1}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={isSubmitDisabled}
        >
          Send
        </button>
      </div>
    </form>
  );
};

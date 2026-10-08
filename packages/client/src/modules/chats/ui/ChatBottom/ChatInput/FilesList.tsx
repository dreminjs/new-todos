import type { FC } from "react";
import styles from "./ChatInput.module.css";

interface IFilesListProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const FilesList: FC<IFilesListProps> = ({ files, onRemove }) => {
  if (files.length === 0) return null;

  return (
    <div className={styles.filesPreview}>
      {files.map((file, i) => (
        <div key={`${file.name}-${i}`} className={styles.filePreviewItem}>
          <span>{file.name}</span>
          <button
            type="button"
            onClick={() => onRemove(i)}
            aria-label="Remove file"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

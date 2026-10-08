import type { FC } from "react";
import type { TAttachment } from "types";
import { LuFile, LuDownload } from "react-icons/lu";
import styles from "./ChatMessagesListItem.module.css";
import { Link } from "react-router";

interface IChatMessageAttachmentsProps {
  attachments: TAttachment[];
}

const getDownloadUrl = (key: string) => {
  return `http://localhost:9001/api/v1/buckets/todos-bucket/objects/download?preview=true&prefix=${encodeURIComponent(
    key,
  )}&version_id=null`;
};

export const ChatMessageAttachments: FC<IChatMessageAttachmentsProps> = ({
  attachments,
}) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className={styles.attachmentsContainer}>
      {attachments.map((attachment) => {
        const isImage = attachment.mimetype?.startsWith("image/");
        const url = getDownloadUrl(attachment.key);

        if (isImage) {
          return (
            <Link
              key={attachment.id}
              to={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.imageAttachmentWrapper}
            >
              <img
                src={url}
                alt={attachment.name}
                className={styles.imageAttachment}
              />
            </Link>
          );
        }

        return (
          <Link
            key={attachment.id}
            to={url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fileAttachmentWrapper}
          >
            <div className={styles.fileIcon}>
              <LuFile size={24} />
            </div>
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{attachment.name}</span>
              <span className={styles.fileSize}>
                {attachment.size
                  ? `${(attachment.size / 1024).toFixed(1)} KB`
                  : "Unknown size"}
              </span>
            </div>
            <div className={styles.downloadIcon}>
              <LuDownload size={20} />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

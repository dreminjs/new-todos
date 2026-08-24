import type { FC } from "react";
import { Link } from "react-router";
import styles from "./WorkspaceChats.module.css";

interface IWorkspaceChatListItemProps {
  title: string;
  id: string;
}

export const WorkspaceChatsListItem: FC<IWorkspaceChatListItemProps> = ({
  title,
  id,
}) => {
  return (
    <li className={styles.workspaceChatsListItem}>
      <Link to={`${id}/chats`}>
        <span className={styles.workspaceChatsListItemName}>{title}</span>
      </Link>
    </li>
  );
};

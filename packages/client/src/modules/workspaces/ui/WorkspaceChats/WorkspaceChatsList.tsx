import type { FC } from "react";
import { useParams } from "react-router";
import { WorkspaceChatsListItem } from "./WorkspaceChatsListItem";
import styles from "./WorkspaceChats.module.css";
import { useGetWorkspaceChats } from "../../../chats/api/queries";

interface IWorkspaceChatsListProps {
  addTodoGroupButton: React.ReactNode;
}

export const WorkspaceChatsList: FC<IWorkspaceChatsListProps> = ({
  addTodoGroupButton,
}) => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: workspaceChatsResponse } = useGetWorkspaceChats(workspaceId!);

  return (
    <ul className={styles.workspaceChatsList}>
      <li>{addTodoGroupButton}</li>
      {workspaceChatsResponse?.map((chat) => (
        <WorkspaceChatsListItem key={chat.id} title={chat.name} id={chat.id} />
      ))}
    </ul>
  );
};

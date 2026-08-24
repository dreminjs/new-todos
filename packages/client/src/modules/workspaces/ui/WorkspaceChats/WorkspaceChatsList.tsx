import type { FC } from "react";
import { useParams } from "react-router";
import { useGetWorkspaceChats } from "../../api/queries";
import { WorkspaceChatsListItem } from "./WorkspaceChatsListItem";
import styles from "./WorkspaceChats.module.css";

interface IWorkspaceChatsListProps {
  addTodoGroupButton: React.ReactNode;
}

export const WorkspaceChatsList: FC<IWorkspaceChatsListProps> = ({
  addTodoGroupButton,
}) => {
  const { workspaceId } = useParams();

  const { data: workspaceChatsResponse } = useGetWorkspaceChats(workspaceId);

  return (
    <ul className={styles.workspaceChatsList}>
      {addTodoGroupButton}
      {workspaceChatsResponse?.map((chat) => (
        <WorkspaceChatsListItem title={chat.name} id={chat.id} />
      ))}
    </ul>
  );
};

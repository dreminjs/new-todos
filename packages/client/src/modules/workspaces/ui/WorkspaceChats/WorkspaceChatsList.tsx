import type { FC } from "react";
import { useParams } from "react-router";
import { WorkspaceChatsListItem } from "./WorkspaceChatsListItem";
import { useGetWorkspaceChats } from "../../../chats/api/queries";
import { DashboardGrid } from "../../../../shared/ui/DashboardGrid/DashboardGrid";

interface IWorkspaceChatsListProps {
  addTodoGroupButton: React.ReactNode;
}

export const WorkspaceChatsList: FC<IWorkspaceChatsListProps> = ({
  addTodoGroupButton,
}) => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: workspaceChatsResponse } = useGetWorkspaceChats(workspaceId!);

  return (
    <DashboardGrid>
      <li>{addTodoGroupButton}</li>
      {workspaceChatsResponse?.map((chat) => (
        <WorkspaceChatsListItem key={chat.id} title={chat.name} id={chat.id} />
      ))}
    </DashboardGrid>
  );
};

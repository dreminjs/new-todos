import { useParams } from "react-router";
import { useGetWorkspaceTodoGroups } from "../../api/queries";
import type React from "react";
import type { FC } from "react";
import { WorkspaceTodoGroupsListItem } from "./WorkspaceTodoGroupsListItem";
import { DashboardGrid } from "../../../../shared/ui/DashboardGrid/DashboardGrid";

interface IWorkspaceTodoGroupListProps {
  addTodoGroupButton: React.ReactNode;
}

export const WorkspaceTodoGroupList: FC<IWorkspaceTodoGroupListProps> = ({
  addTodoGroupButton,
}) => {
  const { workspaceId } = useParams();

  const { data: todoGroups, isPending } =
    useGetWorkspaceTodoGroups(workspaceId);

  if (isPending) return <p>Loading...</p>;

  return (
    <DashboardGrid>
      <li>{addTodoGroupButton}</li>
      {todoGroups?.map((group) => (
        <WorkspaceTodoGroupsListItem
          key={group.id}
          title={group.name}
          id={group.id}
          countOfActiveTodos={group.countOfActiveTodos}
        />
      ))}
    </DashboardGrid>
  );
};

import type { FC } from "react";
import { LuListTodo } from "react-icons/lu";
import { DashboardCard } from "../../../../shared/ui/DashboardCard/DashboardCard";

interface IWorkspaceTodoGroupsListItemProps {
  title: string;
  id: string;
  countOfActiveTodos: number;
}

export const WorkspaceTodoGroupsListItem: FC<
  IWorkspaceTodoGroupsListItemProps
> = ({ title, id, countOfActiveTodos }) => {
  return (
    <DashboardCard
      title={title}
      href={`${id}/todos`}
      icon={<LuListTodo size={24} />}
      subtitle={`${countOfActiveTodos} active todos`}
    />
  );
};

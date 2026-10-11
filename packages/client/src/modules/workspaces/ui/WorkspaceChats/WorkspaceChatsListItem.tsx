import type { FC } from "react";
import { LuMessageSquare } from "react-icons/lu";
import { DashboardCard } from "../../../../shared/ui/DashboardCard/DashboardCard";

interface IWorkspaceChatListItemProps {
  title: string;
  id: string;
}

export const WorkspaceChatsListItem: FC<IWorkspaceChatListItemProps> = ({
  title,
  id,
}) => {
  return (
    <DashboardCard
      title={title}
      href={`${id}`}
      icon={<LuMessageSquare size={24} />}
    />
  );
};

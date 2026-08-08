import type { FC } from "react";
import { Link } from "react-router";

interface IWorkspaceTodoGroupsListItemProps {
  title: string;
  id: string
  countOfActiveTodos: number;
}

export const WorkspaceTodoGroupsListItem: FC<
  IWorkspaceTodoGroupsListItemProps
> = ({ title, id, countOfActiveTodos }) => {
  return (
    <li>
      <Link to={`${id}/todos`}>{title}</Link>
      <span>{`${countOfActiveTodos} active todos`}</span>
    </li>
  );
};

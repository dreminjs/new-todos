import type { FC } from "react";
import { Link } from "react-router";
import styles from "./WorkspaceTodoGroups.module.css";

interface IWorkspaceTodoGroupsListItemProps {
  title: string;
  id: string;
  countOfActiveTodos: number;
}

export const WorkspaceTodoGroupsListItem: FC<
  IWorkspaceTodoGroupsListItemProps
> = ({ title, id, countOfActiveTodos }) => {
  return (
    <li className={styles.workspaceTodoGroupsListItem}>
      <Link to={`${id}/todos`}>
        <span className={styles.workspaceTodoGroupsListItemName}>{title}</span>
        <span>{`${countOfActiveTodos} active todos`}</span>
      </Link>
    </li>
  );
};

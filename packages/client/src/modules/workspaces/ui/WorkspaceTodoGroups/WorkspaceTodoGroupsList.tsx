import { useParams } from "react-router";
import { useGetWorkspaceTodoGroups } from "../../api/queries";
import type React from "react";
import type { FC } from "react";
import styles from "./WorkspaceTodoGroups.module.css";
import { WorkspaceTodoGroupsListItem } from "./WorkspaceTodoGroupsListItem";

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
    <>
      <ul className={styles.workspaceTodoGroupsList}>
        {addTodoGroupButton}
        {todoGroups?.map((group) => (
          <WorkspaceTodoGroupsListItem
            key={group.id}
            title={group.name}
            id={group.id}
            countOfActiveTodos={group.countOfActiveTodos}
          />
        ))}
      </ul>
    </>
  );
};

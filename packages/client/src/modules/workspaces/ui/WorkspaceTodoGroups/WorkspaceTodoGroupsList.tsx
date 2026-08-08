import { useParams } from "react-router";
import { useGetWorkspaceTodoGroups } from "../../api/queries";
import type React from "react";
import type { FC } from "react";
import styles from "./WorkspaceTodoGroups.module.css";

interface IWorkspaceTodoGroupListProps {
  addTodoGroupButton: React.ReactNode;
}

export const WorkspaceTodoGroupList: FC<IWorkspaceTodoGroupListProps> = ({
  addTodoGroupButton,
}) => {
  const { workspaceId } = useParams();

  const { data: todoGroups, isPending } =
    useGetWorkspaceTodoGroups(workspaceId);

  if(isPending) return <p>Loading...</p>;

  return (
    <>
      <ul className={styles.workspaceTodoGroupsList}>
        {addTodoGroupButton}
        {todoGroups?.map((group) => (
          <li key={group.id}></li>
        ))}
      </ul>
    </>
  );
};

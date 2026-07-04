import { useState } from "react";
import {
  CreateTodoGroupModal,
  useGetTodoGroups,
} from "../../../modules/todo-groups";
import styles from "./Sidebar.module.css";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const GroupTodosList = () => {
  const { data } = useGetTodoGroups();
  const [isCreateTodoGroupOpen, setIsCreateTodoGroupOpen] = useState(false);
  const handleToggleCreateTodoGroup = () => {
    setIsCreateTodoGroupOpen((prev) => !prev);
  };
  if (!data?.length) {
    return null;
  }

  return (
    <>
      <div>
        <h3 className={styles.sidebarMenuTitle}>
          <span>my groups todos</span>
          <button onClick={handleToggleCreateTodoGroup}>+</button>
        </h3>
        <ul>
          {data.map((el) => (
            <SidebarMenuItem label={el.name} to={`/todos/group/${el.id}`} />
          ))}
        </ul>
      </div>
      <CreateTodoGroupModal
        isOpen={isCreateTodoGroupOpen}
        onClose={handleToggleCreateTodoGroup}
      />
    </>
  );
};

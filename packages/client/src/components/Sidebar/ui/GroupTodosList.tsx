import { useState } from "react";
import {
  CreateTodoGroupModal,
  useGetTodoGroups,
} from "../../../modules/todo-groups";
import styles from "./Sidebar.module.css";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { CustomAccordion } from "../../../shared";

export const GroupTodosList = () => {
  const { data } = useGetTodoGroups();
  const [isCreateTodoGroupOpen, setIsCreateTodoGroupOpen] = useState(false);

  const handleToggleCreateTodoGroup = () => {
    setIsCreateTodoGroupOpen((prev) => !prev);
  };

  return (
    <>
      <CustomAccordion
        defaultOpen={true}
        header={
          <h3 className={styles.sidebarMenuTitle}>
            <span>my groups todos</span>
            <button onClick={handleToggleCreateTodoGroup}>+</button>
          </h3>
        }
      >
        <ul>
          {data?.map((el) => (
            <SidebarMenuItem
              key={el.id}
              label={el.name}
              to={`/todos/group/${el.id}`}
            />
          ))}
        </ul>
      </CustomAccordion>

      <CreateTodoGroupModal
        isOpen={isCreateTodoGroupOpen}
        onClose={handleToggleCreateTodoGroup}
      />
    </>
  );
};

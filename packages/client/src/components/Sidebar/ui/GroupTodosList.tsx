import { useState } from "react";
import {
  CreateTodoGroupModal,
  useGetTodoGroups,
} from "../../../modules/todo-groups";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { CustomAccordion } from "../../../shared";
import styles from "./Sidebar.module.css";

export const GroupTodosList = () => {
  const { data } = useGetTodoGroups();
  const [isCreateTodoGroupOpen, setIsCreateTodoGroupOpen] = useState(false);
  const handleToggleCreateTodoGroup = () => {
    setIsCreateTodoGroupOpen((prev) => !prev);
  };

  return (
    <>
      <CustomAccordion
        defaultOpen={false}
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
              to={`/todo-groups/${el.id}/todos`}
            />
          ))}
        </ul>2
      </CustomAccordion>
      {isCreateTodoGroupOpen && (
        <CreateTodoGroupModal
          isOpen={isCreateTodoGroupOpen}
          onClose={handleToggleCreateTodoGroup}
        />
      )}
    </>
  );
};

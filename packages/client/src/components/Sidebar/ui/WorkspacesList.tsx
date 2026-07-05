import { CustomAccordion } from "../../../shared";
import styles from "./Sidebar.module.css";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { useGetMyWorkspaces } from "../../../modules/workspaces/api/queries";
import { useState } from "react";
import { CreateWorkspaceModal } from "../../../modules/workspaces";

export const WorkspacesList = () => {
  const { data } = useGetMyWorkspaces();
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] =
    useState(false);
  const handleToggleCreateTodoGroup = () => {
    setIsCreateWorkspaceModalOpen((prev) => !prev);
  };

  return (
    <>
      <CustomAccordion
        defaultOpen={true}
        header={
          <h3 className={styles.sidebarMenuTitle}>
            <span>my workspaces</span>
            <button onClick={handleToggleCreateTodoGroup}>+</button>
          </h3>
        }
      >
        <ul>
          {data?.map((el) => (
            <SidebarMenuItem label={el.name} to={`/workspaces/${el.id}`} />
          ))}
        </ul>
      </CustomAccordion>
      <CreateWorkspaceModal
        isOpen={isCreateWorkspaceModalOpen}
        onClose={handleToggleCreateTodoGroup}
      />
    </>
  );
};

import { CustomAccordion } from "../../../shared";
import styles from "./Sidebar.module.css";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { useGetMyWorkspaces } from "../../../modules/workspaces/api/queries";

export const WorkspacesList = () => {
  const { data, isPending, isError } = useGetMyWorkspaces();
  return (
    <CustomAccordion
      defaultOpen={true}
      header={
        <h3 className={styles.sidebarMenuTitle}>
          <span>my workspaces</span>
          {/*<button onClick={handleToggleCreateTodoGroup}>+</button>*/}
        </h3>
      }
    >
      <ul>
        {data?.map((el) => (
          <SidebarMenuItem label={el.name} to={`/todos/workpace/${el.id}`} />
        ))}
      </ul>
    </CustomAccordion>
  );
};

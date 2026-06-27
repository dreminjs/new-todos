import { SidebarHeader } from "./SidebarHeader";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarBottom } from "./SidebarBottom";
import styles from "./Sidebar.module.css";
import { GroupTodosList } from "./GroupTodosList";
export const SidebarContent = () => {
  return (
    <div className={styles.sidebarContent}>
      <div className={styles.sidebarBody}>
        <SidebarHeader />
        <SidebarMenu />
        <GroupTodosList />
      </div>
      <SidebarBottom />
    </div>
  );
};

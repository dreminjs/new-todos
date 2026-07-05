import { SidebarHeader } from "./SidebarHeader";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarBottom } from "./SidebarBottom";
import { GroupTodosList } from "./GroupTodosList";
import { WorkspacesList } from "./WorkspacesList";
import styles from "./Sidebar.module.css";
import { InboxList } from "./InboxList";
export const SidebarContent = () => {
  return (
    <div className={styles.sidebarContent}>
      <SidebarHeader />
      <div className={styles.sidebarBody}>
        <SidebarMenu />
        <InboxList />
        <GroupTodosList />
        <WorkspacesList />
      </div>
      <SidebarBottom />
    </div>
  );
};

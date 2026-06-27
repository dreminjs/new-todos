import styles from "./Sidebar.module.css";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const WorkspacesList = () => {
  return (
    <div>
      <h3 className={styles.sidebarMenuTitle}>
        <span>my groups todos</span>
        <button>+</button>
      </h3>
      <ul>
        {[].map((el) => (
          <SidebarMenuItem label={el.name} />
        ))}
      </ul>
    </div>
  );
};

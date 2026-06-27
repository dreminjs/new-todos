import { SidebarMenuItem } from "./SidebarMenuItem";
import { sidebarMenuData } from "../model/sidebar.data";
import styles from "./Sidebar.module.css";
export const SidebarMenu = () => {
  return (
    <div className={styles.sidebarMenu}>
      <h3 className={styles.sidebarMenuTitle}>my lists</h3>
      <ul>
        {sidebarMenuData.map(({ label, icon: Icon }, idx) => (
          <SidebarMenuItem
            key={idx}
            icon={<Icon height={22} width={22} />}
            label={label}
          />
        ))}
      </ul>
    </div>
  );
};

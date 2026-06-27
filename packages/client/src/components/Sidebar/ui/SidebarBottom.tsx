import { sidebarMenuBottomData } from "../model/sidebar.data";
import styles from "./Sidebar.module.css";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarBottom = () => {
  return (
    <ul className={styles.sidebarBottom}>
      {sidebarMenuBottomData.map(({ icon: Icon, label }, index) => (
        <SidebarMenuItem
          key={index}
          icon={<Icon width={22} height={22} />}
          label={label}
        />
      ))}
    </ul>
  );
};

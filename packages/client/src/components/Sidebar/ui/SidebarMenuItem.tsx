import type { FC } from "react";
import styles from "./Sidebar.module.css";

interface ISidebarMenuItemProps {
  icon?: React.ReactNode;
  label: string;
}

export const SidebarMenuItem: FC<ISidebarMenuItemProps> = ({ icon, label }) => {
  return (
    <li className={styles.sidebarMenuItem}>
      {icon}
      <span>{label}</span>
    </li>
  );
};

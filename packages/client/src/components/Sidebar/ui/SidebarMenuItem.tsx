import type { FC } from "react";
import styles from "./Sidebar.module.css";
import { Link } from "react-router";

interface ISidebarMenuItemProps {
  icon?: React.ReactNode;
  label: string;
  to: string;
}

export const SidebarMenuItem: FC<ISidebarMenuItemProps> = ({
  icon,
  label,
  to,
}) => {
  return (
    <li className={styles.sidebarMenuItem}>
      <Link className={styles.sidebarMenuItem} to={to}>
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
};

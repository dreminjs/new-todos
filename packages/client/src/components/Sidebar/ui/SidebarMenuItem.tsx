import type { FC } from "react";
import styles from "./Sidebar.module.css";
import { Link } from "react-router";

interface ISidebarMenuItemProps {
  icon?: React.ReactNode;
  label: string;
  to: string;
  onClick?: () => void;
}

export const SidebarMenuItem: FC<ISidebarMenuItemProps> = ({
  icon,
  label,
  to,
  onClick,
}) => {
  return (
    <li className={styles.sidebarMenuItem}>
      <Link className={styles.sidebarMenuItem} to={to} onClick={onClick}>
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
};

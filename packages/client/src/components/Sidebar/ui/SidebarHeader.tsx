import styles from "./Sidebar.module.css";
import LogoIcon from "../../../assets/logo.svg?react";
import { Link } from "react-router";
import { NotificationButton } from "../../../modules/notifications/ui/NotificationButton";

export const SidebarHeader = () => {

  return (
    <header className={styles.sidebarHeader}>
      <Link className={styles.sidebarHeaderLink} to="/home">
        <LogoIcon height={32} width={32} />
        <span className={styles.sidebarHeaderLinkContent}>
          <span className={styles.sidebarHeaderTitle}>Workspace Alpha</span>
          <span className={styles.sidebarHeaderSubtitle}>Tasks Management</span>
        </span>
      </Link>
      <NotificationButton />
    </header>
  );
};

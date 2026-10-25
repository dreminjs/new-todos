import styles from "./Sidebar.module.css";
import { SidebarMenuItem } from "./SidebarMenuItem";
import ProfileIcon from "../../../assets/ProfileIcon.svg?react";
import { LogoutButton } from "./LogoutButton";

export const SidebarBottom = () => {
  return (
    <ul className={styles.sidebarBottom}>
      <SidebarMenuItem
        icon={<ProfileIcon width={22} height={22} />}
        label={"Profile"}
        to={"/profile"}
      />
      <LogoutButton />
    </ul>
  );
};

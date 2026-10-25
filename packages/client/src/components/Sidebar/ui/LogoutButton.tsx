import styles from "./Sidebar.module.css";
import LogoutIcon from "../../../assets/LogoutIcon.svg?react";
import { useLogout } from "../../../modules/auth/api/queries";

export const LogoutButton = () => {
  const { mutate } = useLogout();

  return (
    <li className={styles.sidebarMenuItem}>
      <button onClick={() => mutate()} className={styles.sidebarMenuItem}>
        <LogoutIcon width={22} height={22} />
        <span>{"Logout"}</span>
      </button>
    </li>
  );
};

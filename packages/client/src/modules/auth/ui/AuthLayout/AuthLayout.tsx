import { Outlet } from "react-router";
import styles from "./AuthLayout.module.css";
import { InfoPanel } from "./InfoPanel/InfoPanel";
import { useAuthProtection } from "../../model/hooks/useAuthProtection";

export const AuthLayout = () => {
  useAuthProtection({ forPublicOnly: true });

  return (
    <div className={styles.AuthLayout}>
      <InfoPanel />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

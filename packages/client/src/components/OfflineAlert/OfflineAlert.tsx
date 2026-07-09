import { LuWifi } from "react-icons/lu";
import styles from "./OfflineAlert.module.css";
import { useIsOnline } from "../../hooks/useIsOnline";
export const OfflineAlert = () => {
  const isOnline = useIsOnline();

  const handleReload = () => {
    window.location.reload();
  };

  if (isOnline) {
    return null;
  }

  return (
    <div className={styles.offlineAlert}>
      <LuWifi />
      <h3>You are Offline</h3>
      <button className={styles.reloadButton} onClick={handleReload}>reload the page.</button>
    </div>
  );
};

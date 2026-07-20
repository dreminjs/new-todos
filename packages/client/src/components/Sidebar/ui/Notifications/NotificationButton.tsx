import { LuBell } from "react-icons/lu";
import styles from "./Notifications.module.css";
import { useState } from "react";
import { NotificationsModal } from "./NotificationsModal";

export const NotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button onClick={handleToggle}>
        <LuBell className={styles.notificationButton} color="white" />
      </button>
      <NotificationsModal isOpen={isOpen} onClose={handleToggle} />
    </>
  );
};

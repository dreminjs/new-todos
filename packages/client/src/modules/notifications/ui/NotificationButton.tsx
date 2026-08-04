import { LuBell } from "react-icons/lu";
import styles from "./Notifications.module.css";
import { useState } from "react";
import { NotificationsModal } from "./NotificationsModal";
import { useGetMyNotifications } from "../api/queries";

export const NotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const { items } = useGetMyNotifications();
  return (
    <>
      <button style={{ position: "relative" }} onClick={handleToggle}>
        <LuBell className={styles.notificationButton} color="white" />
        {items?.some((el) => !el.read) && (
          <div
            style={{
              height: 8,
              width: 8,
              position: "absolute",
              backgroundColor: "red",
              borderRadius: "50%",
              top: "8px",
              right: "2px",
            }}
          />
        )}
      </button>
      <NotificationsModal isOpen={isOpen} onClose={handleToggle} />
    </>
  );
};

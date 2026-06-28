import { Portal } from "@chakra-ui/react";
import { useNotificationStore } from "../model/notification.store";
import { NotificationItem } from "./NotificationItem";
import styles from "./Notifiction.module.css";
export const NotificationList = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification,
  );
  return (
    <Portal>
      <ul className={styles.notificationList}>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClear={() => removeNotification(notification.id)}
          />
        ))}
      </ul>
    </Portal>
  );
};

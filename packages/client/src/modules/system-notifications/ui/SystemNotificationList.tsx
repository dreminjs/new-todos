import { Portal } from "@chakra-ui/react";
import { useSystemNotificationStore } from "../model/notification.store";
import { SystemNotificationItem } from "./SystemNotificationItem";
import styles from "./SystemNotifiction.module.css";
export const SystemNotificationList = () => {
  const notifications = useSystemNotificationStore((state) => state.notifications);
  const removeNotification = useSystemNotificationStore(
    (state) => state.removeNotification,
  );
  return (
    <Portal>
      <ul className={styles.notificationList}>
        {notifications.map((notification) => (
          <SystemNotificationItem
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

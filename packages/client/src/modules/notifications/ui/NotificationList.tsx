import { useNotificationStore } from "../model/notification.store";
import { NotificationItem } from "./NotificationItem";
import styles from "./Notifiction.module.css";
export const NotificationList = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification,
  );
  return (
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
  );
};

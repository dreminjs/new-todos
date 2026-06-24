import { useNotificationStore } from "../model/notification.store";
import { NotificationItem } from "./NotificationItem";
import styles from "./Notifiction.module.css";
export const NotificationList = () => {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <ul className={styles.notificationList}>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} />
      ))}
    </ul>
  );
};

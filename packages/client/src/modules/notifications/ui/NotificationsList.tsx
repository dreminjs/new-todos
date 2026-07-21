import { NotificationItem } from "./NotificationsItem";
import { useAcceptInvitation, useRejectInvitation } from "../../workspaces";
import { useGetMyNotifications } from "../api/queries";
import styles from "./Notifications.module.css";

export const NotificationsList = () => {
  const { mutate: acceptInvitation } = useAcceptInvitation();
  const { mutate: rejectInvitation } = useRejectInvitation();
  const { data: notifications, isPending } = useGetMyNotifications();

  if (isPending) return <h3>Loading...</h3>;

  if (!notifications) return <h3>No notifications</h3>;

  return (
    <ul className={styles.notificationsList}>
      {notifications?.map((item) => (
        <NotificationItem
          key={item.id}
          message={item.message}
          id={item.id}
          createdAt={item.createdAt}
          onAccept={acceptInvitation}
          onReject={rejectInvitation}
          read={item.read}
        />
      ))}
    </ul>
  );
};

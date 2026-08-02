import { NotificationItem } from "./NotificationsItem";
import { useAcceptInvitation, useRejectInvitation } from "../../workspaces";
import { useGetMyNotifications } from "../api/queries";
import { useInView } from "react-intersection-observer";
import styles from "./Notifications.module.css";

export const NotificationsList = () => {
  const { mutate: acceptInvitation } = useAcceptInvitation();
  const { mutate: rejectInvitation } = useRejectInvitation();
  const {
    data: notifications,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
  } = useGetMyNotifications();
  const { ref: refInView } = useInView({
    rootMargin: "150px 0px",
    skip: isPending || !hasNextPage || error !== null,
    onChange: (inView) => {
      if (inView) void fetchNextPage();
    },
  });
  if (isPending) return <h3>Loading...</h3>;

  if (!notifications) return <h3>No notifications</h3>;

  return (
    <ul className={styles.notificationsList}>
      {notifications.pages?.map((page) =>
        page.items.map((el) => (
          <NotificationItem
            key={el.id}
            notification={el}
            onAcceptInvite={acceptInvitation}
            onRejectInvite={rejectInvitation}
            onAcceptRequest={function (workspaceRequestId: string): void {
              throw new Error("Function not implemented.");
            }}
            onRejectRequest={function (workspaceRequestId: string): void {
              throw new Error("Function not implemented.");
            }}
          />
        )),
      )}
      {hasNextPage && <li ref={refInView} />}
    </ul>
  );
};

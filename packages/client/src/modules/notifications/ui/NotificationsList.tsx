import { NotificationItem } from "./NotificationsItem";
import { useAcceptInvitation, useRejectInvitation } from "../../workspaces";
import { useGetMyNotifications } from "../api/queries";

export const NotificationsList = () => {
  const { mutate: acceptInvitation } = useAcceptInvitation();
  const { mutate: rejectInvitation } = useRejectInvitation();
  const { data: notifications } = useGetMyNotifications();
  console.log(notifications)
  return (
    <ul>
      {/*{notifications.map((item) => (
        <NotificationItem
          key={item.id}
          message={item.message}
          id={item.id}
          createdAt={item.createdAt}
          onAccept={acceptInvitation}
          onReject={rejectInvitation}
        />
      ))}*/}
    </ul>
  );
};

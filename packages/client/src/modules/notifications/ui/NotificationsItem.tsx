import type { FC } from "react";
import type { TNotification } from "types";
import styles from "./Notifications.module.css";
import { Button } from "../../../shared";

interface INotificationItemProps {
  notification: TNotification;
  onAcceptInvite: (workspaceInvitationId: string) => void;
  onRejectInvite: (workspaceInvitationId: string) => void;
  onAcceptRequest: (workspaceRequestId: string) => void;
  onRejectRequest: (workspaceRequestId: string) => void;
}
export const NotificationItem: FC<INotificationItemProps> = ({
  notification,
  onAcceptInvite,
  onRejectInvite,
  onAcceptRequest,
  onRejectRequest,
}) => {
  const { message, id, createdAt, read } = notification;

  const isInvite = Boolean(notification.workspaceInvitationId);
  const isRequest = Boolean(notification.workspaceRequestId);

  const handlers = isInvite
    ? { onAccept: onAcceptInvite, onReject: onRejectInvite }
    : isRequest
      ? { onAccept: onAcceptRequest, onReject: onRejectRequest }
      : null;

  return (
    <li className={styles.notificationsItem}>
      <h3>{message}</h3>

      {!read && handlers && (
        <div className={styles.notificationsItemButtons}>
          <Button onClick={() => handlers.onAccept(id)}>Accept</Button>
          <Button onClick={() => handlers.onReject(id)}>Reject</Button>
        </div>
      )}
    </li>
  );
};

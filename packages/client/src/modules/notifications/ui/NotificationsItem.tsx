import type { FC } from "react";
import type { TNotification } from "types";
import styles from "./Notifications.module.css";
import { Button } from "../../../shared";
import type {
  TActionInviteParams,
  TActionRequestParams,
} from "../../workspaces/model/workspace.types";

interface INotificationItemProps {
  notification: TNotification;
  onAcceptInvite: (dto: TActionInviteParams) => void;
  onRejectInvite: (dto: TActionInviteParams) => void;
  onAcceptRequest: (dto: TActionRequestParams) => void;
  onRejectRequest: (dto: TActionRequestParams) => void;
}
export const NotificationItem: FC<INotificationItemProps> = ({
  notification,
  onAcceptInvite,
  onRejectInvite,
  onAcceptRequest,
  onRejectRequest,
}) => {
  const { message, id, createdAt, read } = notification;

  console.log(notification)

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
          <Button
            onClick={() =>
              handlers.onAccept({
                workspaceId: notification?.workspaceId ?? null,
                invitationId: notification.workspaceInvitationId ?? null,
                requestId: notification.workspaceRequestId ?? null,
              })
            }
          >
            Accept
          </Button>
          <Button
            onClick={() =>
              handlers.onReject({
                workspaceId: notification?.workspaceId ?? null,
                invitationId: notification.workspaceInvitationId ?? null,
                requestId: notification.workspaceRequestId ?? null,
              })
            }
          >
            Reject
          </Button>
        </div>
      )}
    </li>
  );
};

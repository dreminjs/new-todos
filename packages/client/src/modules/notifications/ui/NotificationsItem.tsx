import type { FC } from "react";
import type { TNotification } from "types";
import styles from "./Notifications.module.css";
import { Button } from "../../../shared";

type TNotificationProps = Omit<TNotification, "userId"> & {
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
};
export const NotificationItem: FC<TNotificationProps> = ({
  message,
  onAccept,
  onReject,
  workspaceInvitationId,
}) => {
  return (
    <li className={styles.notificationItem}>
      <h3>{message}</h3>
      <div>
        <Button>Accept</Button>
        <Button>Reject</Button>
      </div>
    </li>
  );
};

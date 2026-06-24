import type { FC } from "react";
import type {
  INotification,
  TNotificationType,
} from "../model/notification.interface";
import styles from "./Notifiction.module.css";

type TProps = INotification;

const notificationClasses: Record<TNotificationType, string> = {
  success: styles.notificationItemSuccess,
  error: styles.notificationItemError,
  info: styles.notificationItemInfo,
  warning: styles.notificationItemWarning,
};

export const NotificationItem: FC<TProps> = ({ id, message, type }) => {
  return (
    <li className={notificationClasses[type]}>
      <span>{message}</span>
    </li>
  );
};

import { useEffect, type FC } from "react";
import type {
  INotification,
  TNotificationType,
} from "../model/notification.interface";
import { LuX } from "react-icons/lu";
import styles from "./Notifiction.module.css";
import clsx from "clsx";

type TProps = Omit<INotification, "id"> & {
  onClear: () => void;
};

const notificationClasses: Record<TNotificationType, string> = {
  success: styles.notificationItemSuccess,
  error: styles.notificationItemError,
  info: styles.notificationItemInfo,
  warning: styles.notificationItemWarning,
};

export const NotificationItem: FC<TProps> = ({ message, type, onClear }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClear();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClear]);

  return (
    <li className={clsx(notificationClasses[type], styles.notificationItem)}>
      <span>{message}</span>
      <button className={styles.notificationItemCloseButton} onClick={onClear}>
        <LuX />
      </button>
    </li>
  );
};

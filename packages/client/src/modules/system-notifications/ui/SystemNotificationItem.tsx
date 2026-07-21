import { useEffect, type FC } from "react";
import type {
  ISystemNotification,
  TSystemNotificationType,
} from "../model/notification.interface";
import { LuX } from "react-icons/lu";
import styles from "./SystemNotifiction.module.css";
import clsx from "clsx";

type TProps = Omit<ISystemNotification, "id"> & {
  onClear: () => void;
};

const notificationClasses: Record<TSystemNotificationType, string> = {
  success: styles.notificationItemSuccess,
  error: styles.notificationItemError,
  info: styles.notificationItemInfo,
  warning: styles.notificationItemWarning,
};

export const SystemNotificationItem: FC<TProps> = ({
  message,
  type,
  onClear,
  mannualDeleting,
}) => {
  useEffect(() => {
    if (mannualDeleting) return;
    const timer = setTimeout(() => {
      onClear();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClear, mannualDeleting]);

  return (
    <li className={clsx(notificationClasses[type], styles.notificationItem)}>
      <span>{message}</span>
      <button className={styles.notificationItemCloseButton} onClick={onClear}>
        <LuX />
      </button>
    </li>
  );
};

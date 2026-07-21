import { type FC } from "react";
import { Modal } from "../../../shared";
import { NotificationsList } from "./NotificationsList";
interface INotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: FC<INotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {

  return (
    <Modal title="Notifications" isOpen={isOpen} onClose={onClose}>
      <NotificationsList  />
    </Modal>
  );
};

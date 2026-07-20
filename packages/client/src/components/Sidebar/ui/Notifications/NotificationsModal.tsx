import { useEffect, type FC } from "react";
import { Modal } from "../../../../shared";
import { useSocket } from "../../../../app/model/useSocket";

interface INotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: FC<INotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const socket = useSocket();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h3>Notifactions</h3>
      </div>
    </Modal>
  );
};

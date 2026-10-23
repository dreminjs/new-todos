import type { FC } from "react";
import { Modal } from "../../../../../shared";
import { ChangeAvatarButton } from "./ChangeAvatarButton";
import styles from "./ChangeAvatarModal.module.css";
import { RemoveAvatarButton } from "./RemoveAvatarButton";
import { CancelButton } from "./CancelButton";

interface IChangeAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl: string;
}

export const ChangeAvatarModal: FC<IChangeAvatarModalProps> = ({
  isOpen,
  onClose,
  avatarUrl,
}) => {
  return (
    <Modal title="Upload Avatar Photo" isOpen={isOpen} onClose={onClose}>
      <ul className={styles.changeAvatarModalList}>
        <li className={styles.changeAvatarModalListItem}>
          <ChangeAvatarButton onClose={onClose} />
        </li>
        {avatarUrl && (
          <li className={styles.changeAvatarModalListItem}>
            <RemoveAvatarButton onClose={onClose} />
          </li>
        )}
        <li className={styles.changeAvatarModalListItem}>
          <CancelButton onClick={onClose} />
        </li>
      </ul>
    </Modal>
  );
};

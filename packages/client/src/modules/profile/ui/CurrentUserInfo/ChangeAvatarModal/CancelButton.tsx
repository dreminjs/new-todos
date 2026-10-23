import type { FC } from "react";
import styles from "./ChangeAvatarModal.module.css";

interface ICancelButtonProps {
  onClick: () => void;
}

export const CancelButton: FC<ICancelButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      className={styles.changeAvatarModalButton} onClick={onClick}>
      Cancel
    </button>
  );
};

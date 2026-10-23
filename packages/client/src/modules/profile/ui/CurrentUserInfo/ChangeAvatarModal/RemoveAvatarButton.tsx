import clsx from "clsx";
import styles from "./ChangeAvatarModal.module.css";
import { useRemoveAvatar } from "../../../../users";
import type { FC } from "react";

interface IRemoveAvatarButtonProps {
  onClose: () => void;
}

export const RemoveAvatarButton: FC<IRemoveAvatarButtonProps> = ({
  onClose,
}) => {
  const { mutate } = useRemoveAvatar({
    onSettled: onClose,
  });

  return (
    <button
      type="button"
      onClick={() => mutate()}
      className={clsx(
        styles.changeAvatarModalButton,
        styles.removeAvatarButton,
      )}
    >
      Remove current Avatar
    </button>
  );
};

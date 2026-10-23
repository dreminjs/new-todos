import { useRef, type FC } from "react";
import styles from "./ChangeAvatarModal.module.css";
import clsx from "clsx";
import { useUploadAvatar } from "../../../../users";

interface IChangeAvatarButtonProps {
  onClose: () => void;
}

export const ChangeAvatarButton: FC<IChangeAvatarButtonProps> = ({
  onClose,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate } = useUploadAvatar({ onSettled: onClose });

  return (
    <>
      <input
        onChange={(e) => {
          const file = e.target.files?.[0];
          console.log("File uploaded")
          mutate(file);
        }}
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        hidden
      />
      <button
        type="button"
        className={clsx(
          styles.changeAvatarModalButton,
          styles.uploadAvatarButton,
        )}
        onClick={() => inputRef.current.click()}
      >
        Upload Photo
      </button>
    </>
  );
};

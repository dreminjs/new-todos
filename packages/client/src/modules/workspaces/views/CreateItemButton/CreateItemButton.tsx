import { type FC } from "react";
import { LuPlus } from "react-icons/lu";
import styles from "./CreateItemButton.module.css";

interface ICreateItemButtonProps {
  onClick: () => void;
  title: string;
}

export const CreateItemButton: FC<ICreateItemButtonProps> = ({
  onClick,
  title,
}) => {
  return (
    <button className={styles.createItemButton} onClick={onClick}>
      <span className={styles.createItemButtonPlus}>
        <LuPlus size={24} />
      </span>
      <span className={styles.createItemButtonTitle}>{title}</span>
    </button>
  );
};

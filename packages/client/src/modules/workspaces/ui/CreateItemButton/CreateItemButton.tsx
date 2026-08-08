import { type FC } from "react";
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
      <>
        <span className={styles.createItemButtonPlus}>+</span>
        <span className={styles.createItemButtonTitle}>{title}</span>
      </>
    </button>
  );
};

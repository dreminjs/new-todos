import { Button } from "@chakra-ui/react";
import styles from "./TodoFormBottom.module.css";
import type { FC } from "react";
import clsx from "clsx";

interface ITodoFormBottomProps {
  onClose: () => void;
  isLoading: boolean;
  className?: string;
}

export const TodoFormBottom: FC<ITodoFormBottomProps> = ({
  onClose,
  isLoading,
  className,
}) => {
  return (
    <div className={clsx(`${styles.todoFormBottom}`, className)}>
      <Button
        disabled={isLoading}
        type="submit"
        className={styles.submitButton}
      >
        {isLoading ? "Loading..." : "Submit"}
      </Button>
      <Button
        disabled={isLoading}
        onClick={onClose}
        type="button"
        className={styles.closeButton}
      >
        Close
      </Button>
    </div>
  );
};

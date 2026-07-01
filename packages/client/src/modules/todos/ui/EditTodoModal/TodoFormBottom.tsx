import { Button } from "@chakra-ui/react";
import styles from "./EditTodoModal.module.css";
import type { FC } from "react";

interface ITodoFormBottomProps {
  onClose: () => void;
  isLoading: boolean;
}

export const TodoFormBottom: FC<ITodoFormBottomProps> = ({
  onClose,
  isLoading,
}) => {
  return (
    <div className={styles.todoFormBottom}>
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

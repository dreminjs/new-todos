import styles from "./EditTodoModal.module.css";
import type { FC } from "react";
import { FormBottom } from "../../../../shared/";
import { Button } from "@chakra-ui/react";
import { useDeleteTodo } from "../../api/queries";

interface IEditTodoFormBottomProps {
  onClose: () => void;
  isEditLoading: boolean;
  todoId: string;
}

export const EditTodoFormBottom: FC<IEditTodoFormBottomProps> = ({
  onClose,
  isEditLoading,
  todoId,
}) => {
  const { mutate } = useDeleteTodo();

  const handleDeleteTodo = () => {
    mutate(todoId, { onSuccess: onClose });
  };
  return (
    <div className={styles.editTodoFormBottom}>
      <Button
        onClick={handleDeleteTodo}
        type="button"
        className={styles.closeButton}
      >
        Delete
      </Button>
      <FormBottom onClose={onClose} isLoading={isEditLoading} />
    </div>
  );
};

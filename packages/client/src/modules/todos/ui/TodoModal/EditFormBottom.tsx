import styles from "./TodoModal.module.css";
import type { FC } from "react";
import { FormBottom } from "../../../../shared";
import { Button } from "@chakra-ui/react";
import { useDeleteTodo } from "../../api/queries";
import type { TFindAllQuery } from "../../model/todo.interface";

type TEditTodoFormBottomProps = {
  onClose: () => void;
  isEditLoading: boolean;
  todoId: string;
  queryFilters: TFindAllQuery;
};

export const EditTodoFormBottom: FC<TEditTodoFormBottomProps> = ({
  onClose,
  isEditLoading,
  todoId,
  queryFilters,
}) => {
  const { mutate } = useDeleteTodo({
    ...queryFilters,
  });

  const handleDeleteTodo = () => {
    mutate(todoId, { onSuccess: onClose, onError: onClose });
  };
  return (
    <div className={styles.editTodoFormBottom}>
      <Button
        onClick={handleDeleteTodo}
        variant="surface"
        type="button"
        className={styles.closeButton}
      >
        Delete
      </Button>
      <FormBottom onClose={onClose} isLoading={isEditLoading} />
    </div>
  );
};

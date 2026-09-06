import { useForm } from "react-hook-form";
import { FormBottom, FormField, Modal } from "../../../../shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTodoGroup } from "../../api/queries";
import { type FC } from "react";
import type {
  TCreateTodoGroupContext,
} from "../../model/todo-group.dto";
import { createTodoGroupFormSchema } from "../../model/todo-group.schema";
import styles from "./CreateTodoGroupModal.module.css";
import type { TCreateTodoGroupBody } from "types";

interface ICreateTodoGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  todoGroupContext?: TCreateTodoGroupContext;
}

export const CreateTodoGroupModal: FC<ICreateTodoGroupModalProps> = ({
  isOpen,
  onClose,
  todoGroupContext,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateTodoGroupBody>({
    resolver: zodResolver(createTodoGroupFormSchema),
  });

  const { mutate, isPending } = useCreateTodoGroup();
  const handleCreateTodoGroup = (data: TCreateTodoGroupBody) => {
    mutate(
      {
        ...data,
        ...todoGroupContext,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal title="Create New Group Todo" isOpen={isOpen} onClose={onClose}>
      <form
        className={styles.createTodoGroupForm}
        onSubmit={handleSubmit(handleCreateTodoGroup)}
      >
        <FormField<TCreateTodoGroupBody>
          name={"name"}
          register={register}
          error={errors.name?.message}
          label={"Group Name"}
        />
        <FormBottom onClose={onClose} isLoading={isPending} />
      </form>
    </Modal>
  );
};

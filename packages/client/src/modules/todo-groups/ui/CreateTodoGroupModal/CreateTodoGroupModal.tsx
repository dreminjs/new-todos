import { useForm } from "react-hook-form";
import { FormBottom, FormField, Modal } from "../../../../shared";
import { createTodoGroupSchema, type TCreateTodoGroup } from "types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTodoGroup } from "../../api/queries";
import type { FC } from "react";
import styles from "./CreateTodoGroupModal.module.css";

interface ICreateTodoGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTodoGroupModal: FC<ICreateTodoGroupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateTodoGroup>({
    resolver: zodResolver(createTodoGroupSchema),
  });

  const { mutate, isPending } = useCreateTodoGroup();
  const handleCreateTodoGroup = (data: TCreateTodoGroup) => {
    mutate(data, { onSuccess: onClose });
  };
  return (
    <Modal title="Create New Group Todo" isOpen={isOpen} onClose={onClose}>
      <form
        className={styles.createTodoGroupForm}
        onSubmit={handleSubmit(handleCreateTodoGroup)}
      >
        <FormField<TCreateTodoGroup>
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

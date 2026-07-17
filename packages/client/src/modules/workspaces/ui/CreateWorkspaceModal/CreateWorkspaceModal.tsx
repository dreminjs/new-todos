import type { FC } from "react";
import { FormBottom, FormField, Modal } from "../../../../shared";
import { useCreateWorkspace } from "../../api/queries";
import { createWorkspaceSchema, type TCreateWorkspace } from "types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./CreateWorkspaceModal.module.css";

interface ICreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateWorkspaceModal: FC<ICreateWorkspaceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { mutate, isPending } = useCreateWorkspace();
  const { register, formState, handleSubmit, reset } =
    useForm<TCreateWorkspace>({
      resolver: zodResolver(createWorkspaceSchema),
    });

  const handleCreateWorkspace = (data: TCreateWorkspace) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal title="Create Workspace" isOpen={isOpen} onClose={onClose}>
      <form
        className={styles.createWorkspaceForm}
        onSubmit={handleSubmit(handleCreateWorkspace)}
      >
        <FormField<TCreateWorkspace>
          register={register}
          name="name"
          error={formState.errors.name?.message}
          label="Name"
        />
        <FormField<TCreateWorkspace>
          register={register}
          name="description"
          error={formState.errors.description?.message}
          label="Description"
        />
        <FormBottom onClose={onClose} isLoading={isPending} />
      </form>
    </Modal>
  );
};

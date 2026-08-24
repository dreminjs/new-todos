import { useForm } from "react-hook-form";
import { FormBottom, FormField, Modal } from "../../../../shared";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateChat } from "../../api/queries";

import styles from "./CreateChatModal.module.css";
import type { FC } from "react";
import type {
  TCreateChatContext,
  TCreateChatForm,
} from "../../model/chat.types";
import { createChatFormSchema } from "../../model/chat.schema";

interface ICreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatContext: TCreateChatContext;
}

export const CreateChatModal: FC<ICreateChatModalProps> = ({
  isOpen,
  onClose,
  chatContext,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateChatForm>({
    resolver: zodResolver(createChatFormSchema),
  });

  const { mutate, isPending } = useCreateChat();
  const handleCreateChat = (data: TCreateChatForm) => {
    mutate(
      {
        ...data,
        ...chatContext,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal title="Create New Chat" isOpen={isOpen} onClose={onClose}>
      <form
        className={styles.createTodoGroupForm}
        onSubmit={handleSubmit(handleCreateChat)}
      >
        <FormField<TCreateChatForm>
          name={"name"}
          register={register}
          error={errors.name?.message}
          label={"Chat Name"}
        />
        <FormBottom onClose={onClose} isLoading={isPending} />
      </form>
    </Modal>
  );
};

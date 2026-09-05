import { useForm } from "react-hook-form";
import { FormBottom, FormField, Modal } from "../../../../shared";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateChat } from "../../api/queries";
import styles from "./CreateChatModal.module.css";
import type { FC } from "react";
import {
  createChatBodySchema,
  type TCreateChatContext,
  type TCreateChatBodyDto,
} from "types";

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
  } = useForm<TCreateChatBodyDto>({
    resolver: zodResolver(createChatBodySchema),
  });

  const { mutate, isPending } = useCreateChat(chatContext);
  const handleCreateChat = (data: TCreateChatBodyDto) => {
    mutate(
      {
        name: data.name,
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
        <FormField<TCreateChatBodyDto>
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

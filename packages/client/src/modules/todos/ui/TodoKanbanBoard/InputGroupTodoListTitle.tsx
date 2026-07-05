import { useForm } from "react-hook-form";
import { Button, FormField } from "../../../../shared";
import { useUpdateTodoGroup } from "../../../todo-groups";
import { useRef, type FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodoGroupSchema, type TCreateTodoGroup } from "types";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./TodoKanbanBoard.module.css";

interface InputGroupTodoListTitleProps {
  groupId: string;
  onClose: () => void;
  name: string;
}

export const InputGroupTodoListTitle: FC<InputGroupTodoListTitleProps> = ({
  groupId,
  onClose,
  name,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  useOnClickOutside(formRef, onClose);
  const { mutate } = useUpdateTodoGroup(groupId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateTodoGroup>({
    resolver: zodResolver(createTodoGroupSchema),
    defaultValues: { name: name },
  });

  const onSubmit = (data: TCreateTodoGroup) => {
    mutate(data, {
      onSuccess: () => {
        onClose();
        reset();
      },
    });
  };

  return (
    <form
      ref={formRef}
      className={styles.TodoKanbanBoardHeaderTitleContainer}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        name={"name"}
        register={register}
        error={errors?.name?.message}
      />
      <Button type="submit">Update</Button>
    </form>
  );
};

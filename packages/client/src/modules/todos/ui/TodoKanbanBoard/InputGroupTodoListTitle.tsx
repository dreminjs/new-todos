import { useForm } from "react-hook-form";
import { Button, FormField } from "../../../../shared";
import { useUpdateTodoGroup } from "../../../todo-groups";
import { useRef, type FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type TCreateTodoGroup } from "types";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./TodoKanbanBoard.module.css";
import { createTodoGroupFormSchema } from "../../../todo-groups/model/todo-group.schema";
import type { TCreateTodoGroupForm } from "../../../todo-groups/model/todo-group.dto";

interface InputGroupTodoListTitleProps {
  onClose: () => void;
  dto: TCreateTodoGroup;
}

export const InputGroupTodoListTitle: FC<InputGroupTodoListTitleProps> = ({
  onClose,
  dto,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  useOnClickOutside(formRef, onClose);
  const { mutate } = useUpdateTodoGroup({
    userId: dto.userId,
    id: dto.id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateTodoGroupForm>({
    resolver: zodResolver(createTodoGroupFormSchema),
    defaultValues: { name: dto.name },
  });

  const onSubmit = (data: TCreateTodoGroup) => {
    console.log(data);
    mutate(data, () => {
      onClose();
      reset();
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

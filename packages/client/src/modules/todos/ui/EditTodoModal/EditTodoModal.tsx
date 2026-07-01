import { useEffect, type FC } from "react";
import {
  CustomDatePicker,
  FormField,
  Modal,
  CustomSelect,
} from "../../../../shared";
import { useCreateTodo, useUpdateTodo } from "../../api/queries";
import { useGetParticipants } from "../../../workspaces";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoFormSchema } from "../../model/todo.schema";
import type {
  ICreateTodoContext,
  TCreateTodo,
} from "../../model/todo.interface";
import {
  COLOR_TODO_PRIORITY,
  TODO_PRIORITY_OPTIONS,
  TODO_STATUS_OPTIONS,
} from "../../model/todo.constants";
import styles from "./EditTodoModal.module.css";
import { TodoFormBottom } from "./TodoFormBottom";

type TEditTodoModalProps = {
  onClose: () => void;
  isOpen: boolean;
  showAssignee: boolean;
  todoId: string;
} & TCreateTodo &
  ICreateTodoContext;

export const EditTodoModal: FC<TEditTodoModalProps> = ({
  isOpen,
  showAssignee,
  onClose,
  todoId,
  ...props
}) => {
  const {
    register,
    control,
    formState: { errors },
    watch,
    handleSubmit,
    reset,
  } = useForm<TCreateTodo>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      status: props.status,
      title: props.title,
      description: props.description,
      priority: props.priority,
      deadline: props.deadline,
    },
  });

  const { mutate, ...rest } = useUpdateTodo(
    {
      todoId,
      status: props.status,
      workspaceId: props.workspaceId,
      isMyToday: props.isMyToday,
      todoGroupId: props.todoGroupId,
    },
    reset,
  );

  const { data } = useGetParticipants({ enable: showAssignee });

  return (
    <Modal onClose={onClose} isOpen={isOpen} title="Edit Todo">
      <form onSubmit={handleSubmit(mutate)} className={styles.editTodoForm}>
        <FormField<TCreateTodo>
          name={"title"}
          register={register}
          error={errors.title?.message}
          label={"Title"}
          className={styles.fieldTitle}
        />
        <FormField<TCreateTodo>
          name={"description"}
          register={register}
          error={errors.description?.message}
          label={"Description"}
          isTextarea
          className={styles.fieldDescription}
        />
        <Controller
          render={({ field }) => (
            <CustomSelect
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              register={register}
              label={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
              options={TODO_STATUS_OPTIONS}
              className={styles.selectStatus}
              placeholder="Status"
            />
          )}
          name={"status"}
          control={control}
        />

        <Controller
          render={({ field }) => (
            <CustomSelect
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              register={register}
              label={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
              options={TODO_PRIORITY_OPTIONS}
              className={styles.selectPriority}
              placeholder="Priority"
              color={
                watch("priority") && COLOR_TODO_PRIORITY[watch("priority")]
              }
            />
          )}
          name={"priority"}
          control={control}
        />
        {showAssignee && (
          <Controller
            render={({ field }) => (
              <CustomSelect
                name={"userId"}
                register={register}
                label={"Assignee"}
                options={
                  data?.map((user) => ({
                    value: user.user.id,
                    label: `${user.user.firstName} ${user.user.lastName}`,
                  })) ?? []
                }
                className={styles.selectAssignee}
                onChange={field.onChange}
              />
            )}
            name={"userId"}
            control={control}
          />
        )}

        <Controller
          control={control}
          name={"deadline"}
          render={({ field }) => (
            <CustomDatePicker
              label="Deadline"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <TodoFormBottom onClose={onClose} isLoading={rest.isPending} />
      </form>
    </Modal>
  );
};

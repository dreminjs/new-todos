import { useEffect, useMemo, type FC } from "react";
import {
  CustomDatePicker,
  FormField,
  Modal,
  CustomSelect,
  FormBottom,
  CustomCheckbox,
} from "../../../../shared";
import { useCreateTodo } from "../../api/queries";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ICreateTodoContext, TFindAllQuery } from "../../model/todo.types";
import {
  COLOR_TODO_PRIORITY,
  TODO_PRIORITY_OPTIONS,
  TODO_STATUS_OPTIONS,
} from "../../model/todo.constants";
import styles from "./TodoModal.module.css";
import {
  buildTodoFormSchema,
  type TCreateTodoForm,
} from "../../model/buildTodo.schema";

type TAddTodoModalProps = {
  onClose: () => void;
  isOpen: boolean;
  showAssignee: boolean;
  queryFilters: TFindAllQuery;
  todoContext?: ICreateTodoContext;
};

export const AddTodoModal: FC<TAddTodoModalProps> = ({
  showAssignee,
  ...props
}) => {
  const formSchema = useMemo(
    () => buildTodoFormSchema(props.queryFilters.planned),
    [props.queryFilters.planned],
  );

  const handleSuccess = () => {
    props.onClose();
    reset();
  };
  const {
    register,
    control,
    formState: { errors },
    watch,
    handleSubmit,
    reset,
  } = useForm<TCreateTodoForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: props.todoContext?.status,
      priority: props.todoContext?.priority,
      isMyToday: props.todoContext?.isMyToday || false,
    },
  });

  const { mutate, ...rest } = useCreateTodo({
    queryKeyFilters: props.queryFilters,
    todoContext: props.todoContext,
    cb: handleSuccess,
  });

  return (
    <Modal title="Add Todo" {...props}>
      <form onSubmit={handleSubmit(mutate)} className={styles.todoForm}>
        <FormField<TCreateTodoForm>
          name={"title"}
          register={register}
          error={errors.title?.message}
          label={"Title"}
          className={styles.fieldTitle}
        />
        <FormField<TCreateTodoForm>
          name={"description"}
          register={register}
          error={errors.description?.message}
          label={"Description"}
          isTextarea
          className={styles.fieldDescription}
        />
        <Controller
          control={control}
          name={"isMyToday"}
          render={({ field }) => {
            return (
              <CustomCheckbox
                onChange={field.onChange}
                value={field.value}
                className={styles.toggleIsMyDayCheckbox}
                variant={"outline"}
                title="Is my day"
              />
            );
          }}
        />

        <Controller
          control={control}
          name={"status"}
          render={({ field }) => (
            <CustomSelect
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              label={field?.name.charAt(0).toUpperCase() + field?.name.slice(1)}
              options={TODO_STATUS_OPTIONS}
              className={styles.selectStatus}
              placeholder="Status"
            />
          )}
        />

        <Controller
          name={"priority"}
          control={control}
          render={({ field }) => (
            <CustomSelect
              value={field.value}
              onChange={field.onChange}
              name={field.name}
              label={field?.name.charAt(0).toUpperCase() + field?.name.slice(1)}
              options={TODO_PRIORITY_OPTIONS}
              className={styles.selectPriority}
              placeholder="Priority"
              disabled={Boolean(props.todoContext?.priority)}
              color={
                watch("priority") && COLOR_TODO_PRIORITY[watch("priority")]
              }
            />
          )}
        />

        <Controller
          control={control}
          name={"deadline"}
          render={({ field }) => (
            <CustomDatePicker
              label="Deadline"
              value={field.value}
              onChange={field.onChange}
              error={errors.deadline?.message}
            />
          )}
        />

        <FormBottom
          className={styles.todoFormBottom}
          onClose={props.onClose}
          isLoading={rest.isPending}
        />
      </form>
    </Modal>
  );
};

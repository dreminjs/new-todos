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
import { useGetParticipants } from "../../../workspaces";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ICreateTodoContext,
  TFindAllQuery,
} from "../../model/todo.interface";
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
  planned: boolean;
  queryFilters: TFindAllQuery;
  todoContext?: ICreateTodoContext;
};

export const AddTodoModal: FC<TAddTodoModalProps> = ({
  showAssignee,
  ...props
}) => {
  const formSchema = useMemo(
    () => buildTodoFormSchema(props.planned),
    [props.planned],
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

  const { data } = useGetParticipants({ enable: showAssignee });

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
            console.log(field.value);
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
              disabled={Boolean(props.todoContext?.priority)}
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

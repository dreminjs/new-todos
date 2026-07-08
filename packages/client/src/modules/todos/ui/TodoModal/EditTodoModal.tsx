import { type FC } from "react";
import {
  CustomDatePicker,
  FormField,
  Modal,
  CustomSelect,
  CustomCheckbox,
} from "../../../../shared";
import { useUpdateTodo } from "../../api/queries";
import { useGetParticipants } from "../../../workspaces";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoFormSchema } from "../../model/todo.schema";
import type {
  ICreateTodoContext,
  TCreateTodo,
  TFindAllQuery,
} from "../../model/todo.interface";
import {
  COLOR_TODO_PRIORITY,
  TODO_PRIORITY_OPTIONS,
  TODO_STATUS_OPTIONS,
} from "../../model/todo.constants";
import { EditTodoFormBottom } from "./EditFormBottom";
import styles from "./TodoModal.module.css";

type TEditTodoModalProps = {
  onClose: () => void;
  isOpen: boolean;
  showAssignee: boolean;
  queryFilters: TFindAllQuery;
  dto: TCreateTodo & ICreateTodoContext;
};

export const EditTodoModal: FC<TEditTodoModalProps> = ({
  isOpen,
  showAssignee,
  onClose,
  queryFilters,
  dto,
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
      status: dto.status,
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      deadline: dto.deadline,
      isMyToday: dto.isMyToday,
    },
  });

  const { mutate, ...rest } = useUpdateTodo(
    {
      dto,
      queryFilters,
    },
    () => {
      reset();
      onClose();
    },
  );

  const { data } = useGetParticipants({ enable: showAssignee });

  return (
    <Modal onClose={onClose} isOpen={isOpen} title="Edit Todo">
      <form onSubmit={handleSubmit(mutate)} className={styles.todoForm}>
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
            <CustomCheckbox
              className={styles.toggleIsMyDayCheckbox}
              variant={"outline"}
              title="Is my day"
              onChange={field.onChange}
              value={field.value}
            />
          )}
          name={"isMyToday"}
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
              className={styles.selectDeadline}
            />
          )}
        />
        <EditTodoFormBottom
          todoId={dto.id}
          onClose={onClose}
          isEditLoading={rest.isPending}
          queryFilters={queryFilters}
        />
      </form>
    </Modal>
  );
};

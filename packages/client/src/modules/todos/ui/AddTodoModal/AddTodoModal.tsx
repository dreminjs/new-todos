import { useMemo, type FC } from "react";
import {
  CustomDatePicker,
  FormField,
  Modal,
  CustomSelect,
  FormBottom,
} from "../../../../shared";
import { useCreateTodo } from "../../api/queries";
import { useGetParticipants } from "../../../workspaces";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ICreateTodoContext } from "../../model/todo.interface";
import {
  COLOR_TODO_PRIORITY,
  TODO_PRIORITY_OPTIONS,
  TODO_STATUS_OPTIONS,
} from "../../model/todo.constants";
import styles from "./AddTodoModal.module.css";
import {
  buildTodoFormSchema,
  type TCreateTodoForm,
} from "../../model/buildTodo.schema";

type TAddTodoModalProps = {
  onClose: () => void;
  isOpen: boolean;
  showAssignee: boolean;
  planned: boolean;
} & ICreateTodoContext;

export const AddTodoModal: FC<TAddTodoModalProps> = ({
  showAssignee,
  ...props
}) => {
  const formSchema = useMemo(
    () => buildTodoFormSchema(props.planned),
    [props.planned],
  );
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
      status: props.status,
      priority: props.priority,
    },
  });

  const { mutate, ...rest } = useCreateTodo(
    {
      status: props.status,
      workspaceId: props.workspaceId,
      isMyToday: props.isMyToday,
      todoGroupId: props.todoGroupId,
      priority: props.priority,
    },
    reset,
  );

  const { data } = useGetParticipants({ enable: showAssignee });

  return (
    <Modal title="Add Todo" {...props}>
      <form onSubmit={handleSubmit(mutate)} className={styles.addTodoForm}>
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
              disabled={Boolean(props.priority)}
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

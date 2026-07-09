import { useState, type FC } from "react";
import { InputGroupTodoListTitle } from "./InputGroupTodoListTitle";
import { DeleteTodoGroupButton } from "./DeleteTodoGroupButton";
import type { TCreateTodoGroup } from "types";
import styles from "./TodoKanbanBoard.module.css";
import { useUpdateTodoGroup } from "../../../todo-groups";
import type { TCreateTodoGroupForm } from "../../../todo-groups/model/todo-group.dto";
import clsx from "clsx";

type TodoGroupKanbanBoardHeaderProps = TCreateTodoGroup;

export const TodoGroupKanbanBoardHeader: FC<TodoGroupKanbanBoardHeaderProps> = (
  props,
) => {
  const { mutate, isPending } = useUpdateTodoGroup(props);
  const [isTyping, setIsTyping] = useState(false);
  const onSubmit = (data: TCreateTodoGroupForm) => {
    mutate(data);
    setIsTyping(false);
  };
  const handleToggleTyping = () => {
    setIsTyping((prev) => !prev);
  };

  return (
    <header className={styles.TodoKanbanBoardHeader}>
      <h3>
        {isTyping ? (
          <InputGroupTodoListTitle
            onClose={handleToggleTyping}
            onMutate={onSubmit}
            dto={props}
          />
        ) : (
          <button
            className={clsx(isPending && styles.groupNameLoading)}
            disabled={isPending}
            onClick={handleToggleTyping}
          >
            {props.name}
          </button>
        )}
      </h3>
      <DeleteTodoGroupButton todoGroupId={props.id} />
    </header>
  );
};

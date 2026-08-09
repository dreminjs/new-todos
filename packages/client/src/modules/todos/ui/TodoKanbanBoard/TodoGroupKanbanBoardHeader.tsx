import { useState, type FC } from "react";
import { InputGroupTodoListTitle } from "./InputGroupTodoListTitle";
import { DeleteTodoGroupButton } from "./DeleteTodoGroupButton";
import { useUpdateTodoGroup } from "../../../todo-groups";
import { useParams } from "react-router";
import type { TCreateTodoGroupForm } from "../../../todo-groups/model/todo-group.dto";
import type { TCreateTodoGroupBody } from "types";
import styles from "./TodoKanbanBoard.module.css";
import clsx from "clsx";

type TodoGroupKanbanBoardHeaderProps = TCreateTodoGroupBody;

export const TodoGroupKanbanBoardHeader: FC<TodoGroupKanbanBoardHeaderProps> = (
  props,
) => {
  const { groupId } = useParams();
  const { mutate, isPending } = useUpdateTodoGroup(groupId!);
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
      <DeleteTodoGroupButton todoGroupId={groupId} />
    </header>
  );
};

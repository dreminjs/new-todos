import { useState, type FC } from "react";
import styles from "./TodoKanbanBoard.module.css";
import { InputGroupTodoListTitle } from "./InputGroupTodoListTitle";
import { DeleteTodoGroupButton } from "./DeleteTodoGroupButton";
import type { TCreateTodoGroup } from "types";

type TodoGroupKanbanBoardHeaderProps = TCreateTodoGroup;

export const TodoGroupKanbanBoardHeader: FC<TodoGroupKanbanBoardHeaderProps> = (
  dto,
) => {
  const [isTyping, setIsTyping] = useState(false);
  const handleToggleTyping = () => {
    setIsTyping((prev) => !prev);
  };

  return (
    <header className={styles.TodoKanbanBoardHeader}>
      <h3>
        {isTyping ? (
          <InputGroupTodoListTitle onClose={handleToggleTyping} dto={dto} />
        ) : (
          <button onClick={handleToggleTyping}>{dto.name}</button>
        )}
      </h3>
      <DeleteTodoGroupButton todoGroupId={dto.id} />
    </header>
  );
};

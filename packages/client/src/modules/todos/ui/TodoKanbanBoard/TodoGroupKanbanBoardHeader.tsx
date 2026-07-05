import { useState, type FC } from "react";
import styles from "./TodoKanbanBoard.module.css";
import { InputGroupTodoListTitle } from "./InputGroupTodoListTitle";
import { DeleteTodoGroupButton } from "./DeleteTodoGroupButton";

interface TodoGroupKanbanBoardHeaderProps {
  todoGroupId: string;
  name: string;
}

export const TodoGroupKanbanBoardHeader: FC<
  TodoGroupKanbanBoardHeaderProps
> = ({ todoGroupId, name }) => {
  const [isTyping, setIsTyping] = useState(false);
  const handleToggleTyping = () => {
    setIsTyping((prev) => !prev);
  };

  return (
    <header className={styles.TodoKanbanBoardHeader}>
      <h3>
        {isTyping ? (
          <InputGroupTodoListTitle
            name={name}
            groupId={todoGroupId}
            onClose={handleToggleTyping}
          />
        ) : (
          <button onClick={handleToggleTyping}>{name}</button>
        )}
      </h3>
      <DeleteTodoGroupButton todoGroupId={todoGroupId} />
    </header>
  );
};

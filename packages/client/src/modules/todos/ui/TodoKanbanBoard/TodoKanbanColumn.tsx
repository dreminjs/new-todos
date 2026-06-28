import { Fragment, useState, type FC } from "react";
import type {
  ICreateTodoContext,
  IKanbanColumn,
  TFindAllQuery,
} from "../../model/todo.interface";
import { TodoItem } from "./TodoItem";
import styles from "./TodoKanbanBoard.module.css";
import { AddTodoModal } from "../AddTodoModal/AddTodoModal";
import { useGetTodos } from "../../api/queries";
import { Skeleton } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/react";

type TKanbanColumn = IKanbanColumn & {
  showAssignee: boolean;
} & ICreateTodoContext &
  Omit<TFindAllQuery, "priority">;

export const TodoKanbanColumn: FC<TKanbanColumn> = ({
  title,
  showAssignee,
  ...props
}) => {
  const [todoModalOpen, setTodoModalOpen] = useState(false);

  const { ref } = useDroppable({
    id: props.status,
  });

  const handleTodoModalToggle = () => setTodoModalOpen((prev) => !prev);

  const { data: todos, isLoading } = useGetTodos({
    ...props,
    status: props.status,
  });

  console.log(todos);

  if (isLoading) {
    return <Skeleton bg={"gray.100"} height="400px" />;
  }

  return (
    <>
      <div className={styles.TodoKanbanBoardColumn}>
        <h3 className={styles.TodoKanbanBoardHeading}>
          <span>
            <span className={styles.TodoKanbanBoardStatus}>{title}</span>
            <span className={styles.TodoKanbanBoardCount}>
              {todos.pages.reduce((acc, page) => acc + page.items.length, 0)}
            </span>
          </span>
          <button
            onClick={handleTodoModalToggle}
            className={styles.TodoKanbanBoardPlus}
          >
            +
          </button>
        </h3>
        <ul className={styles.TodoKanbanBoardColumnList} ref={ref}>
          {todos.pages.map((page) => (
            <Fragment key={`draggable-${page.nextCursor}-${props.status}`}>
              {page.items.map((item) => (
                <TodoItem
                  key={`draggable-${item.id}-${props.status}`}
                  {...item}
                />
              ))}
            </Fragment>
          ))}
        </ul>
      </div>
      <AddTodoModal
        isOpen={todoModalOpen}
        onClose={handleTodoModalToggle}
        showAssignee={showAssignee}
        isMyToday={props.isMyToday}
        todoGroupId={props.todoGroupId}
        workspaceId={props.workspaceId}
        status={props.status}
      />
    </>
  );
};

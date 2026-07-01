import { Fragment, useEffect, useState, type FC } from "react";
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
import { PRIORITY_WEIGHT } from "../../model/todo.constants";
import { EditTodoModal } from "../EditTodoModal/EditTodoModal";
import type { TTodo } from "types";
import { TodoKanbanHeader } from "./TodoKanbanHeader";

type TKanbanColumn = IKanbanColumn & {
  showAssignee: boolean;
  endpoint?: string;
} & ICreateTodoContext &
  Omit<TFindAllQuery, "priority">;

export const TodoKanbanColumn: FC<TKanbanColumn> = ({
  title,
  showAssignee,
  endpoint,
  ...props
}) => {
  const { ref } = useDroppable({
    id: props.status,
  });

  const { data: todos, isLoading } = useGetTodos(
    {
      ...props,
      status: props.status,
    },
    endpoint,
  );

  const [editingTodo, setEditingTodo] = useState<TTodo>(null);

  const [todoModalOpen, setTodoModalOpen] = useState(false);

  const handleTodoModalToggle = () => setTodoModalOpen((prev) => !prev);

  const handleSetEditTodo = (todo: TTodo | null) => {
    setEditingTodo(todo);
  };

  if (isLoading) return null;

  return (
    <>
      <div className={styles.TodoKanbanBoardColumn}>
        <TodoKanbanHeader
          title={title}
          todos={todos}
          handleTodoModalToggle={handleTodoModalToggle}
        />
        <ul className={styles.TodoKanbanBoardColumnList} ref={ref}>
          {todos?.pages?.map((page) => (
            <Fragment key={`draggable-${page.nextCursor}-${props.status}`}>
              {page.items
                .sort((a, b) => {
                  const weightA =
                    a.priority != null ? PRIORITY_WEIGHT[a.priority] : Infinity;
                  const weightB =
                    b.priority != null ? PRIORITY_WEIGHT[b.priority] : Infinity;
                  return weightA - weightB;
                })
                .map((item) => (
                  <TodoItem
                    onChoose={handleSetEditTodo.bind(null, item)}
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
      {editingTodo?.id && (
        <EditTodoModal
          todoId={editingTodo.id}
          onClose={handleSetEditTodo.bind(null, null)}
          isOpen={Boolean(editingTodo)}
          showAssignee={showAssignee}
          status={editingTodo?.status}
          title={editingTodo?.title}
          description={editingTodo?.description}
          priority={editingTodo?.priority}
          deadline={
            editingTodo?.deadline != null
              ? new Date(editingTodo?.deadline)
              : null
          }
        />
      )}
    </>
  );
};

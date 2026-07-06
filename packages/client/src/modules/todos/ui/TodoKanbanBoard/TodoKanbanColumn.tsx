import { Fragment, useState, type FC } from "react";
import type {
  ICreateTodoContext,
  IKanbanColumn,
  TFindAllQuery,
} from "../../model/todo.interface";
import { TodoItem } from "./TodoItem";
import { AddTodoModal } from "../TodoModal/AddTodoModal";
import { useGetTodos } from "../../api/queries";
import { useDroppable } from "@dnd-kit/react";
import { PRIORITY_WEIGHT } from "../../model/todo.constants";
import { EditTodoModal } from "../TodoModal/EditTodoModal";
import { TodoKanbanHeader } from "./TodoKanbanHeader";
import { useOnInView } from "react-intersection-observer";
import type { TTodo } from "types";
import styles from "./TodoKanbanBoard.module.css";
type TKanbanColumn = IKanbanColumn & {
  showAssignee: boolean;
  endpoint?: string;
  queryFilters: Omit<TFindAllQuery, "status" | "deadline">;
} & ICreateTodoContext;

export const TodoKanbanColumn: FC<TKanbanColumn> = ({
  title,
  showAssignee,
  endpoint,
  ...props
}) => {
  const { ref: droppableRef } = useDroppable({
    id: props.status,
  });
  const {
    data: todos,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useGetTodos(
    {
      ...props.queryFilters,
      status: props.status,
    },
    endpoint,
  );
  const trackingRef = useOnInView(
    (inView) => {
      if (inView && hasNextPage) {
        fetchNextPage();
      }
    },
    {
      rootMargin: "200px",
    },
  );

  const [editingTodo, setEditingTodo] = useState<TTodo>(null);

  const [todoModalOpen, setTodoModalOpen] = useState(false);

  const handleTodoModalToggle = () => setTodoModalOpen((prev) => !prev);

  const handleSetEditTodo = (todo: TTodo | null) => {
    setEditingTodo(todo);
  };

  return (
    <>
      <div className={styles.TodoKanbanBoardColumn}>
        <TodoKanbanHeader
          title={title}
          todos={todos}
          handleTodoModalToggle={handleTodoModalToggle}
          isPostDisabled={isLoading}
        />
        <ul className={styles.TodoKanbanBoardColumnList} ref={droppableRef}>
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
              <li ref={trackingRef} aria-hidden="true" />
            </Fragment>
          ))}
        </ul>
      </div>
      <AddTodoModal
        planned={props.queryFilters?.planned}
        showAssignee={showAssignee}
        onClose={handleTodoModalToggle}
        isOpen={todoModalOpen}
        queryFilters={{
          ...props.queryFilters,
          status: props.status,
        }}
        todoContext={{
          status: props.status,
          workspaceId: props.workspaceId,
          todoGroupId: props.todoGroupId,
          priority: props.priority,
          isMyToday: props.isMyToday,
        }}
      />
      {editingTodo?.id && (
        <EditTodoModal
          todoId={editingTodo.id}
          onClose={handleSetEditTodo.bind(null, null)}
          isOpen={Boolean(editingTodo)}
          showAssignee={showAssignee}
          dto={{
            status: editingTodo.status,
            title: editingTodo.title,
            description: editingTodo.description,
            priority: editingTodo.priority,
            isMyToday: editingTodo.isMyToday,
            deadline:
              editingTodo?.deadline != null
                ? new Date(editingTodo?.deadline)
                : null,
          }}
          queryFilters={{
            ...props.queryFilters,
            status: props.status,
          }}
        />
      )}
    </>
  );
};

import { useParams } from "react-router";
import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";
import { TodoGroupKanbanBoardHeader } from "../ui/TodoKanbanBoard/TodoGroupKanbanBoardHeader";
import { KanbanPageWrapper } from "../ui/KanbanPageWrapper/KanbanPageWrapper";
import { useGetTodoGroup } from "../../todo-groups";
import { GlobalLoadingSpinner } from "../../../shared";
import type { TFindAllQuery } from "../model/todo.interface";
import { useEffect } from "react";

const TodosGroupPage = () => {
  const { groupId } = useParams();
  const {
    data: todoGroup,
    isPending,
    status,
    fetchStatus,
  } = useGetTodoGroup(groupId!);

  useEffect(() => {
    console.log({
      fetchStatus,
      status,
    });
  }, [fetchStatus, status]);

  const queryFilters: TFindAllQuery = { todoGroupId: groupId, limit: 10 };

  if (isPending && !todoGroup) return <GlobalLoadingSpinner />;

  return (
    <KanbanPageWrapper>
      <TodoGroupKanbanBoardHeader
        name={todoGroup.name}
        id={todoGroup.id}
        userId={todoGroup.userId}
      />
      <TodoKanbanBoard
        queryFilters={queryFilters}
        dtoContext={{
          todoGroupId: groupId,
        }}
      />
    </KanbanPageWrapper>
  );
};

export default TodosGroupPage;

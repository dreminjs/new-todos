import { useParams } from "react-router";
import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";
import { TodoGroupKanbanBoardHeader } from "../ui/TodoKanbanBoard/TodoGroupKanbanBoardHeader";
import { KanbanPageWrapper } from "../ui/KanbanPageWrapper/KanbanPageWrapper";
import { useGetTodoGroup } from "../../todo-groups";
import { GlobalLoadingSpinner } from "../../../shared";

const TodosGroupPage = () => {
  const { groupId } = useParams();
  const { data: todoGroup, isPending } = useGetTodoGroup(groupId!);

  if (isPending && !todoGroup) return <GlobalLoadingSpinner />;

  return (
    <KanbanPageWrapper>
      <TodoGroupKanbanBoardHeader
        name={todoGroup?.name}
        todoGroupId={groupId}
      />
      <TodoKanbanBoard
        queryFilters={{
          todoGroupId: groupId,
          limit: 10,
        }}
      />
    </KanbanPageWrapper>
  );
};

export default TodosGroupPage;

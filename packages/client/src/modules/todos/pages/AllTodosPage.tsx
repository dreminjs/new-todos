import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";
import AllTasksIcon from "../../../assets/AllTasksIcon.svg?react";
import { SystemTodoKanbanBoardHeader } from "../ui/TodoKanbanBoard/SystemTodoKandbanBoardHeader";
import { KanbanPageWrapper } from "../ui/KanbanPageWrapper/KanbanPageWrapper";
export const AllTodosPage = () => {
  return (
    <KanbanPageWrapper>
      <SystemTodoKanbanBoardHeader
        icon={<AllTasksIcon height={30} width={30} />}
        title="All Todos"
      />
      <TodoKanbanBoard queryFilters={{ limit: 10 }} />
    </KanbanPageWrapper>
  );
};

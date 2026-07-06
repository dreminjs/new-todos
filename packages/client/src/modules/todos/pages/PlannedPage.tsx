import { KanbanPageWrapper } from "../ui/KanbanPageWrapper/KanbanPageWrapper";
import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";
import PlannedIcon from "../../../assets/Calendar.svg?react";
import { SystemTodoKanbanBoardHeader } from "../ui/TodoKanbanBoard/SystemTodoKandbanBoardHeader";

const PlannedPage = () => {
  return (
    <KanbanPageWrapper>
      <SystemTodoKanbanBoardHeader
        icon={<PlannedIcon height={30} width={30} />}
        title="Planned Todos"
      />
      <TodoKanbanBoard
        queryFilters={{
          planned: true,
          limit: 10,
        }}
      />
    </KanbanPageWrapper>
  );
};

export default PlannedPage;

import { SystemTodoKanbanBoardHeader } from "../ui/TodoKanbanBoard/SystemTodoKandbanBoardHeader";
import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";
import StarIcon from "../../../assets/ImportantIcon.svg?react";
import { KanbanPageWrapper } from "../ui/KanbanPageWrapper/KanbanPageWrapper";

export const ImportantPage = () => {
  return (
    <KanbanPageWrapper>
      <SystemTodoKanbanBoardHeader
        icon={<StarIcon height={30} width={30} />}
        title="Important Todos"
      />
      <TodoKanbanBoard
        priority="HIGH"
        queryFilters={{ limit: 10, priority: "HIGH" }}
      />
    </KanbanPageWrapper>
  );
};

export default ImportantPage;

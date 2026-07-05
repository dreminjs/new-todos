import { format } from "date-fns";
import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";
import { KanbanPageWrapper } from "../ui/KanbanPageWrapper/KanbanPageWrapper";
import SunIcon from "../../../assets/SunIcon.svg?react";
import { SystemTodoKanbanBoardHeader } from "../ui/TodoKanbanBoard/SystemTodoKandbanBoardHeader";

export const MyDayPage = () => {
  return (
    <KanbanPageWrapper>
      <SystemTodoKanbanBoardHeader
        icon={<SunIcon height={30} width={30} />}
        title="My day"
      />
      <TodoKanbanBoard
        endpoint="my-day"
        deadline={format(new Date(), "yyyy-MM-dd")}
        isMyToday={true}
        limit={10}
      />
    </KanbanPageWrapper>
  );
};

export default MyDayPage;

import { format } from "date-fns";
import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";

export const MyDayPage = () => {
  return (
    <>
      <TodoKanbanBoard
        endpoint="my-day"
        deadline={format(new Date(), "yyyy-MM-dd")}
        showAssignee={false}
        isMyToday={true}
        limit={60}
      />
    </>
  );
};

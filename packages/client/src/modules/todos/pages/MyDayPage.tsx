import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";

export const MyDayPage = () => {
  return (
    <>
      <TodoKanbanBoard showAssignee={false} isMyToday={true} limit={10} />
    </>
  );
};

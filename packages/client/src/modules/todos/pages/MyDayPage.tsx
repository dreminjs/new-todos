import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";

export const MyDayPage = () => {
  return (
    <div>
      <TodoKanbanBoard showAssignee={false} isMyToday={true} limit={10} />
    </div>
  );
};

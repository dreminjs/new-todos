import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";

const PlannedPage = () => {
  return (
    <>
      <TodoKanbanBoard planned limit={60} />
    </>
  );
};

export default PlannedPage;

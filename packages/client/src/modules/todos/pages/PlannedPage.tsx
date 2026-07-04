import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";

const PlannedPage = () => {
  return (
    <>
      <TodoKanbanBoard planned limit={10} />
    </>
  );
};

export default PlannedPage;

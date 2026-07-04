import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";

export const ImportantPage = () => {
  return (
    <>
      <TodoKanbanBoard priority="HIGH" limit={60} />
    </>
  );
};

export default ImportantPage;

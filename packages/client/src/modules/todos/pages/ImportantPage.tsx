import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";

export const ImportantPage = () => {
  return (
    <>
      <TodoKanbanBoard priority="HIGH" limit={10} />
    </>
  );
};

export default ImportantPage;

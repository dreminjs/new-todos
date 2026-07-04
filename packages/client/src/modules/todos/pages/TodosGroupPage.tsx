import { useParams } from "react-router";
import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";

const TodosGroupPage = () => {
  const { groupId } = useParams();
  return <TodoKanbanBoard todoGroupId={groupId} limit={5} />;
};

export default TodosGroupPage;

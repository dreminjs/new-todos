import { useParams } from "react-router";
import { TodoKanbanBoard } from "../../todos";

export const AllWorkspaceTodosPage = () => {
  const { workspaceId } = useParams();

  return (
    <>
      <TodoKanbanBoard
        dtoContext={{
          workspaceId: workspaceId,
        }}
        queryFilters={{
          workspaceId: workspaceId,
          limit: 10,
        }}
      />
    </>
  );
};

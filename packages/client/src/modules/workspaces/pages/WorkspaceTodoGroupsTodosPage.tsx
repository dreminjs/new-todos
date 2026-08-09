import { useParams } from "react-router";
import { TodoKanbanBoard } from "../../todos";
import { useConnectWorkspaceTodoGroupRoom } from "../model/hooks/useConnectWorkspaceTodoGroupRoom";

export const WorkspaceTodoGroupsTodosPage = () => {
  useConnectWorkspaceTodoGroupRoom();
  const { todoGroupId, workspaceId } = useParams();

  return (
    <>
      <TodoKanbanBoard
        dtoContext={{ todoGroupId, workspaceId }}
        queryFilters={{ todoGroupId, limit: 10 }}
      />
    </>
  );
};

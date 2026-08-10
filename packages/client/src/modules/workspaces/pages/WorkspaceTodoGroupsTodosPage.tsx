import { useParams } from "react-router";
import { TodoKanbanBoard } from "../../todos";
import { useSyncWorkspaceTodoGroupTodos } from "../model/hooks/useSyncTodoGroupTodos";

export const WorkspaceTodoGroupsTodosPage = () => {
  const params = useParams();
  useSyncWorkspaceTodoGroupTodos({
    todoGroupId: params.todoGroupId,
    workspaceId: params.workspaceId,
  });

  return (
    <>
      <TodoKanbanBoard
        dtoContext={{
          todoGroupId: params.todoGroupId,
          workspaceId: params.workspaceId,
        }}
        queryFilters={{ workspaceId: params.workspaceId, todoGroupId: params.todoGroupId, limit: 10 }}
      />
    </>
  );
};

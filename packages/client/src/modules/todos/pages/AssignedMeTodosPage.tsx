import { KanbanPageWrapper } from "../ui/KanbanPageWrapper/KanbanPageWrapper";
import { SystemTodoKanbanBoardHeader } from "../ui/TodoKanbanBoard/SystemTodoKandbanBoardHeader";
import { TodoKanbanBoard } from "../ui/TodoKanbanBoard/TodoKandbanBoard";
import AssignedMeIcon from "../../../assets/AssignedMeIcon.svg?react";
import { useGetMe } from "../../users";
import { Spinner } from "@chakra-ui/react";

const AssignedMeTodosPage = () => {
  const { data: currentUserId, isPending } = useGetMe("id");
  if (isPending) <Spinner />;
  return (
    <>
      <KanbanPageWrapper>
        <SystemTodoKanbanBoardHeader
          title="Assigned to me todos"
          icon={<AssignedMeIcon />}
        />
        <TodoKanbanBoard
          dtoContext={{ assigneeId: currentUserId }}
          queryFilters={{ limit: 10, assignedUserId: currentUserId }}
        />
      </KanbanPageWrapper>
    </>
  );
};

export default AssignedMeTodosPage;

import { useState } from "react";
import { CreateTodoGroupModal } from "../../../todo-groups";
import { CreateItemButton } from "../CreateItemButton/CreateItemButton";
import { WorkspaceTodoGroupList } from "./WorkspaceTodoGroupsList";
import { useParams } from "react-router";

export const WorkspaceTodoGroups = () => {
  const { workspaceId } = useParams();

  const [isTodoGroupOpen, setIsTodoGroupOpen] = useState(false);

  const handleTodoGroupToggle = () => {
    setIsTodoGroupOpen((prev) => !prev);
  };

  return (
    <>
      <WorkspaceTodoGroupList
        addTodoGroupButton={
          <CreateItemButton
            onClick={handleTodoGroupToggle}
            title={"Create Todo Group"}
          />
        }
      />
      {isTodoGroupOpen && (
        <CreateTodoGroupModal
          isOpen={isTodoGroupOpen}
          onClose={handleTodoGroupToggle}
          todoGroupContext={{
            workspaceId,
          }}
        />
      )}
    </>
  );
};

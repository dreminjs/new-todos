import { useState } from "react";
import { useParams } from "react-router";
import { WorkspaceChatsList } from "./WorkspaceChatsList";
import { CreateChatModal } from "../../../chats";
import { CreateItemButton } from "../../views/CreateItemButton/CreateItemButton";

export const WorkspaceChats = () => {
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);

  const handleChatToggle = () => {
    setIsCreateChatOpen((prev) => !prev);
  };

  const { workspaceId } = useParams();

  return (
    <>
      <WorkspaceChatsList
        addTodoGroupButton={
          <CreateItemButton onClick={handleChatToggle} title={"Create Chat"} />
        }
      />
      <CreateChatModal
        isOpen={isCreateChatOpen}
        onClose={handleChatToggle}
        chatContext={{ workspaceId }}
      />
    </>
  );
};

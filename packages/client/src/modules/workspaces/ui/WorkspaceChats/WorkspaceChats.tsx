import { useState } from "react";
import { useParams } from "react-router";
import { WorkspaceChatsList } from "./WorkspaceChatsList";
import { CreateChatModal } from "../../../chats";
import { CreateItemButton } from "../../views/CreateItemButton/CreateItemButton";
import type { TCreateChatContext } from "types";
import { GlobalLoadingSpinner } from "../../../../shared";

export const WorkspaceChats = () => {
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);

  const handleChatToggle = () => {
    setIsCreateChatOpen((prev) => !prev);
  };

  const params = useParams<TCreateChatContext>();

  if (!params.workspaceId) {
    return <GlobalLoadingSpinner/>
  }

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
        chatContext={{ workspaceId: params.workspaceId }}
      />
    </>
  );
};

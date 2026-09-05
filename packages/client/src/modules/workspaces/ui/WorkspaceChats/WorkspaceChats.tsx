import { useState } from "react";
import { useParams } from "react-router";
import { WorkspaceChatsList } from "./WorkspaceChatsList";
import { CreateChatModal } from "../../../chats";
import { CreateItemButton } from "../../views/CreateItemButton/CreateItemButton";
import type { TCreateChatContext } from "types";

export const WorkspaceChats = () => {
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);

  const handleChatToggle = () => {
    setIsCreateChatOpen((prev) => !prev);
  };

  const params = useParams<TCreateChatContext>();

  console.log(params);

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
        chatContext={params}
      />
    </>
  );
};

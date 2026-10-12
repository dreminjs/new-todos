import { useParams, useNavigate } from "react-router";
import { CallRoom } from "../ui/CallRoom";

export const CallPage = () => {
  const { workspaceId, chatId } = useParams<{
    workspaceId: string;
    chatId: string;
  }>();
  const navigate = useNavigate();

  if (!chatId || !workspaceId) {
    return null;
  }

  return (
    <CallRoom
      callId={chatId}
      chatId={chatId}
      workspaceId={workspaceId}
      onLeave={() => {
        navigate(`/workspaces/${workspaceId}/chats/${chatId}`);
      }}
    />
  );
};

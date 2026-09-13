import { useParams } from "react-router";
import { useGetCurrentEditMessage } from "../../model/hooks/useGetCurrentEditMessage";
import { ChatEditMessage } from "./ChatEditMessage/ChatEditMessage";
import { ChatInput } from "./ChatInput/ChatInput";
import { ChatReplyMessage } from "./ChatReplyMessage/ChatReplyMessage";

export const ChatBottom = () => {
  const { chatId, workspaceId } = useParams<{
    chatId: string;
    workspaceId: string;
  }>();

  const editMessage = useGetCurrentEditMessage({
    workspaceId,
    chatId,
  });

  return (
    <>
      <div>
        <ChatReplyMessage />
        <ChatEditMessage />
        <ChatInput
          key={editMessage?.content ?? "new"}
          initialContent={editMessage?.content ?? ""}
        />
      </div>
    </>
  );
};

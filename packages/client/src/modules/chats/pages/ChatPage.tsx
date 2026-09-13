import { useEscapeToClose } from "../../../shared/model/hooks/useEscapeToClose";
import { useChatStore } from "../model/chat.store";
import { Chat } from "../ui/Chat/Chat";

export const ChatPage = () => {
  const onSetReplyId = useChatStore((state) => state.onSetReplyId);
  useEscapeToClose(() => onSetReplyId(null), true);
  return <Chat />;
};

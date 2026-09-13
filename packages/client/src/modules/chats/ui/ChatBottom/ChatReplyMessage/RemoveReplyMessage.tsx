import { useChatStore } from "../../../model/chat.store";

export const RemoveReplyMessage = () => {
  const replyMessageId = useChatStore((state) => state.onSetReplyId);

  return <button onClick={() => replyMessageId(null)}>X</button>;
};

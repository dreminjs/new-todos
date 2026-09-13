import { useChatStore } from "../chat.store";

export const useClearReplyMessageId = () => {
  const setReplyMessageId = useChatStore((state) => state.onSetReplyId);
  return () => {
    setReplyMessageId(null);
  };
};

import { useChatStore } from "../../../model/chat.store";

export const RemoveEditMessage = () => {
  const onSetEditMessageId = useChatStore((state) => state.onSetEditMessageId);

  return <button onClick={() => onSetEditMessageId(null)}>X</button>;
};

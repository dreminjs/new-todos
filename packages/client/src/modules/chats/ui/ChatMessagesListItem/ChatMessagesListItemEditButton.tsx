import { Menu } from "@chakra-ui/react";
import type { FC } from "react";
import { useChatStore } from "../../model/chat.store";

interface IChatMessagesListItemEditButtonProps {
  messageId: string;
}

export const ChatMessagesListItemEditButton: FC<
  IChatMessagesListItemEditButtonProps
> = ({ messageId }) => {
  const onSetEditMessageId = useChatStore((state) => state.onSetEditMessageId);

  return (
    <>
      <Menu.Item value="edit" onClick={() => onSetEditMessageId(messageId)}>
        Edit
      </Menu.Item>
    </>
  );
};

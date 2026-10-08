import { Menu, Icon } from "@chakra-ui/react";
import type { FC } from "react";
import { useChatStore } from "../../model/chat.store";
import { LuPencil } from "react-icons/lu";

interface IChatMessagesListItemEditButtonProps {
  messageId: string;
}

export const ChatMessagesListItemEditButton: FC<
  IChatMessagesListItemEditButtonProps
> = ({ messageId }) => {
  const onSetEditMessageId = useChatStore((state) => state.onSetEditMessageId);

  return (
    <Menu.Item 
      value="edit" 
      onClick={() => onSetEditMessageId(messageId)}
      display="flex"
      justifyContent="space-between"
    >
      Edit
      <Icon as={LuPencil} color="gray.500" />
    </Menu.Item>
  );
};

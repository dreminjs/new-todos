import { Menu, Icon } from "@chakra-ui/react";
import type { FC } from "react";
import { useChatStore } from "../../model/chat.store";
import { LuReply } from "react-icons/lu";

interface IChatMessagesListItemReplyButtonProps {
  messageId: string;
}

export const ChatMessagesListItemReplyButton: FC<
  IChatMessagesListItemReplyButtonProps
> = ({ messageId }) => {
  const onSetReplyId = useChatStore((state) => state.onSetReplyId);

  return (
    <Menu.Item 
      value="reply" 
      onClick={() => onSetReplyId(messageId)}
      display="flex"
      justifyContent="space-between"
    >
      Reply
      <Icon as={LuReply} color="gray.500" />
    </Menu.Item>
  );
};

import { Menu } from "@chakra-ui/react";
import type { FC } from "react";
import { useChatStore } from "../../model/chat.store";

interface IChatMessagesListItemReplyButtonProps {
  messageId: string;
}

export const ChatMessagesListItemReplyButton: FC<
  IChatMessagesListItemReplyButtonProps
> = ({ messageId }) => {
  const onSetReplyId = useChatStore((state) => state.onSetReplyId);

  return (
    <>
      <Menu.Item value="edit" onClick={() => onSetReplyId(messageId)}>
        Reply
      </Menu.Item>
    </>
  );
};

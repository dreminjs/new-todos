import { Menu } from "@chakra-ui/react";
import type { FC } from "react";

interface IChatMessagesListItemEditButtonProps {
  messageId: string;
}

export const ChatMessagesListItemEditButton: FC<
  IChatMessagesListItemEditButtonProps
> = ({ messageId }) => {
  return (
    <>
      <Menu.Item value="edit">Edit</Menu.Item>
    </>
  );
};

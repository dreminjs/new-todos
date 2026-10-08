import { Menu, Icon } from "@chakra-ui/react";
import type { FC } from "react";
import { useDeleteChatMessage } from "../../api/queries";
import { useParams } from "react-router";
import { LuTrash2 } from "react-icons/lu";

interface IChatMessagesListItemDeleteButtonProps {
  messageId: string;
}

export const ChatMessagesListItemDeleteButton: FC<
  IChatMessagesListItemDeleteButtonProps
> = ({ messageId }) => {
  const { chatId, workspaceId } = useParams<{
    chatId: string;
    workspaceId: string;
  }>();
  const { mutate } = useDeleteChatMessage({ chatId, workspaceId });

  return (
    <Menu.Item
      onClick={() => mutate(messageId)}
      value="Delete"
      color="red.500"
      _hover={{ bg: "red.50" }}
      display="flex"
      justifyContent="space-between"
    >
      Delete
      <Icon as={LuTrash2} />
    </Menu.Item>
  );
};

import { Menu } from "@chakra-ui/react";
import type { FC } from "react";
import { useDeleteChatMessage } from "../../api/queries";
import { useParams } from "react-router";

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
    <>
      <Menu.Item
        onClick={() => {
          mutate(messageId);
        }}
        value="Delete"
      >
        Delete
      </Menu.Item>
    </>
  );
};

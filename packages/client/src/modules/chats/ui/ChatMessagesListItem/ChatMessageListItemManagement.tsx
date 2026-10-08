import type { FC } from "react";
import { ChatMessagesListItemEditButton } from "./ChatMessagesListItemEditButton";
import { ChatMessagesListItemDeleteButton } from "./ChatMessagesListItemDeleteButton";
import { ChatMessagesListItemReplyButton } from "./ChatMessagesListItemReplyButton";
import { Menu } from "@chakra-ui/react";

interface IChatMessageListItemManagement {
  isMine: boolean;
  messageId: string;
}

export const ChatMessageListItemManagement: FC<
  IChatMessageListItemManagement
> = ({ isMine, messageId }) => {
  return (
    <Menu.Positioner>
      <Menu.Content 
        minWidth="140px" 
        boxShadow="md" 
        borderRadius="xl" 
        padding="1" 
        border="1px solid" 
        borderColor="gray.200"
      >
        {isMine ? (
          <>
            <ChatMessagesListItemReplyButton messageId={messageId} />
            <Menu.Separator />
            <ChatMessagesListItemEditButton messageId={messageId} />
            <ChatMessagesListItemDeleteButton messageId={messageId} />
          </>
        ) : (
          <>
            <ChatMessagesListItemReplyButton messageId={messageId} />
          </>
        )}
      </Menu.Content>
    </Menu.Positioner>
  );
};

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
    <>
      <>
        <Menu.Positioner position={"absolute"} top={0} left={0}>
          <Menu.Content>
            {isMine ? (
              <>
                <ChatMessagesListItemEditButton messageId={messageId} />
                <ChatMessagesListItemDeleteButton messageId={messageId} />
                <ChatMessagesListItemReplyButton messageId={messageId} />
              </>
            ) : (
              <>
                <ChatMessagesListItemReplyButton messageId={messageId} />
              </>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </>
    </>
  );
};

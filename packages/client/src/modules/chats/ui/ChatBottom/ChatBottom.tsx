import { ChatInput } from "./ChatInput/ChatInput";
import { ChatReplyMessage } from "./ChatReplyMessage/ChatReplyMessage";

export const ChatBottom = () => {
  return (
    <>
      <div>
        <ChatReplyMessage />
        <ChatInput />
      </div>
    </>
  );
};

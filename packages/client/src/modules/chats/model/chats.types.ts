import type { TCreateChatMessageBodyDto } from "types";

export interface IChatContext {
  workspaceId: string;
  chatId: string;
}

export type TEditMessageDto = TCreateChatMessageBodyDto & {
  id: string;
};

import type { TCreateChatMessageBodyDto } from "types";
import type { createChatMessageFormDtoSchema } from "./chats.schema";
import z from "zod";

export interface IChatContext {
  workspaceId: string;
  chatId: string;
}


export type TCreateChatMessageFormDto = z.infer<typeof createChatMessageFormDtoSchema>
export type TEditMessageDto = TCreateChatMessageBodyDto & {
  id: string;
};

export interface RemoteParticipant {
  socketId: string;
  stream: MediaStream;
}

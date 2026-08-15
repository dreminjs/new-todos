import { z } from "zod";
import {
  chatMessageSchema,
  chatsSchema,
  createChatBodySchema,
  createChatMessageBodySchema,
  extendedChatMessageSchema,
  joinChatRoomBodySchema,
  updateChatBodySchema,
  updateChatMessageBodySchema,
} from "./chats.schema.js";

export type TChat = z.infer<typeof chatsSchema>;

export type TCreateChatBodyDto = z.infer<typeof createChatBodySchema>;

export type TUpdateChatBodyDto = z.infer<typeof updateChatBodySchema>;

export type TJoinChatRoomBodyDto = z.infer<typeof joinChatRoomBodySchema>;

export type TExtendedChatMessage = z.infer<typeof extendedChatMessageSchema>;

export type TChatMessage = z.infer<typeof chatMessageSchema>;

export type TCreateChatMessageBodyDto = z.infer<
  typeof createChatMessageBodySchema
>;

export interface IWsChatMessageDeletedPayload {
  chatMessageId: string;
}

export type TUpdateChatMessageBodyDto = z.infer<
  typeof updateChatMessageBodySchema
>;

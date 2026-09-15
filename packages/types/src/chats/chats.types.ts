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
import { userSchema } from "../user/user.schema.js";
import { workspaceSchema } from "../workspace/workspace.schema.js";

export type TChat = z.infer<typeof chatsSchema>;

export type TCreateChatBodyDto = z.infer<typeof createChatBodySchema>;

export type TUpdateChatBodyDto = z.infer<typeof updateChatBodySchema>;

export type TJoinChatRoomBodyDto = z.infer<typeof joinChatRoomBodySchema>;

export type TExtendedChatMessage = Omit<
  z.infer<typeof chatMessageSchema>,
  "userId" | "replyToId" | "workspaceId"
> & {
  user: z.infer<typeof userSchema> | null;
  workspace: z.infer<typeof workspaceSchema>;
  replyTo?: TExtendedChatMessage | null;
};

export type TChatMessage = z.infer<typeof chatMessageSchema>;

export type TCreateChatMessageBodyDto = z.infer<
  typeof createChatMessageBodySchema
>;

export interface IWsChatMessageDeletedPayload {
  chatMessageId: string;
  workspaceId: string;
  chatId: string;
}

export type TUpdateChatMessageBodyDto = z.infer<
  typeof updateChatMessageBodySchema
>;

export type TCreateChatContext = Omit<TChat, "name" | "id">;

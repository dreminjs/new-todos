
import { z } from "zod";
import { chatsSchema, createChatBodySchema, updateChatBodySchema } from "./chats.schema.js";

export type TChat = z.infer<typeof chatsSchema>;

export type TCreateChatBodyDto = z.infer<typeof createChatBodySchema>;

export type TUpdateChatBodyDto = z.infer<typeof updateChatBodySchema>;

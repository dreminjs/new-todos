import { z } from "zod";
import { userSchema } from "../user/user.schema.js";
import { todoGroupSchema } from "../todo-groups/todo-groups.schema.js";
import { TExtendedChatMessage } from "./chats.types.js";

export const chatsSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  workspaceId: z.uuid(),
});

export const createChatBodySchema = chatsSchema.omit({
  id: true,
  workspaceId: true,
});

export const updateChatBodySchema = createChatBodySchema;

export const joinChatRoomBodySchema = chatsSchema.pick({
  id: true,
});

export const chatMessageSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  userId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  chatId: z.uuid(),
  replyToId: z.uuid().nullish(),
});

export const extendedChatMessageSchema: z.ZodType<TExtendedChatMessage> =
  chatMessageSchema
    .omit({
      userId: true,
      replyToId: true,
    })
    .extend({
      user: userSchema.nullable(),
      replyTo: z.lazy(() => extendedChatMessageSchema).nullish(),
    });

export const createChatMessageBodySchema = chatMessageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  chatId: true,
});

export const updateChatMessageBodySchema = createChatMessageBodySchema.omit({
  replyToId: true,
});

// model ChatMessage {
//   id        String        @id @default(uuid())
//   content   String
//   chatId    String
//   userId    String
//   replyToId String?
//   createdAt DateTime      @default(now())
//   updatedAt DateTime      @updatedAt
//   chat      Chat          @relation(fields: [chatId], references: [id])
//   replyTo   ChatMessage?  @relation("MessageReplies", fields: [replyToId], references: [id])
//   replies   ChatMessage[] @relation("MessageReplies")
//   user      User          @relation(fields: [userId], references: [id])
// }

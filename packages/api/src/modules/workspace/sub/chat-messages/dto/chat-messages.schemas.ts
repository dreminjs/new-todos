import z from "zod";

export const chatMessagePathSchema = z.object({
  workspaceId: z.uuid(),
  chatId: z.uuid(),
  chatMessageId: z.uuid(),
});

export const createChatMessagePathSchema = chatMessagePathSchema.omit({
  chatMessageId: true,
});

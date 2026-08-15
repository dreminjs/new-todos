import { z } from "zod";

export const chatsSchema = z.object({
  id: z.uuid(),
  name: z.uuid(),
  workspaceId: z.uuid(),
});

export const createChatBodySchema = chatsSchema.omit({
  id: true,
});

export const updateChatBodySchema = createChatBodySchema.pick({
  name: true
})

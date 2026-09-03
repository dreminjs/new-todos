import { chatsSchema, createChatBodySchema } from "types";
import z from "zod";

export const findWorkspaceChatsPathParams = z.object({
  workspaceId: z.string(),
  id: z.string(),
});

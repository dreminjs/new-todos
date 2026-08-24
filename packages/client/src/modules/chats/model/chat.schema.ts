import { createChatBodySchema } from "types";

export const createChatFormSchema = createChatBodySchema.omit({
  workspaceId: true,
});

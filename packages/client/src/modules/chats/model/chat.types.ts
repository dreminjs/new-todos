import type z from "zod";
import type { createChatFormSchema } from "./chat.schema";
import type { TChat } from "types";

export type TCreateChatForm = z.infer<typeof createChatFormSchema>;
export type TCreateChatContext = Pick<TChat, "workspaceId">;

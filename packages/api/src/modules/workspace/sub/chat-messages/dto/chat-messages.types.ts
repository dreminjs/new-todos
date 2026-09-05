import { createZodDto } from "nestjs-zod";
import {
  createChatMessageBodySchema,
  infinityQueryParamsSchema,
  joinChatRoomBodySchema,
  TCreateChatMessageBodyDto,
  TUpdateChatMessageBodyDto,
  updateChatMessageBodySchema,
} from "types";
import {
  chatMessagePathSchema,
  createChatMessagePathSchema,
} from "./chat-messages.schemas.js";
import z from "zod";

export class JoinChatRoomDto extends createZodDto(joinChatRoomBodySchema) {}

export class CreateMessageBodyDto extends createZodDto(
  createChatMessageBodySchema,
) {}

export class UpdateMessageBodyDto extends createZodDto(
  updateChatMessageBodySchema,
) {}

export type TCreateMessageDto = TCreateChatMessageBodyDto & {
  userId: string;
  workspaceId: string;
  chatId: string;
};

export type TUpdateMessageDto = TUpdateChatMessageBodyDto & { userId: string };

export class GetChatMessagesQuery extends createZodDto(
  infinityQueryParamsSchema,
) {}

export class ChatMessagesPathParams extends createZodDto(
  chatMessagePathSchema,
) {}
export class GetChatMessagePathParams extends createZodDto(
  chatMessagePathSchema.omit({
    chatMessageId: true,
  }),
) {}

export class CreateChatMessagePathParams extends createZodDto(
  createChatMessagePathSchema,
) {}

export type TChatMessagesPathParams = z.infer<typeof chatMessagePathSchema>;

export type TCreateChatMessagesPathParams = z.infer<
  typeof createChatMessagePathSchema
>;

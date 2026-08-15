import { createZodDto } from "nestjs-zod";
import {
  createChatMessageBodySchema,
  infinityQueryParamsSchema,
  joinChatRoomBodySchema,
  TCreateChatMessageBodyDto,
  TUpdateChatMessageBodyDto,
} from "types";

export class JoinChatRoomDto extends createZodDto(joinChatRoomBodySchema) {}

export class CreateMessageBodyDto extends createZodDto(
  createChatMessageBodySchema,
) {}

export class UpdateMessageBodyDto extends createZodDto(
  createChatMessageBodySchema,
) {}

export type TCreateMessageDto = TCreateChatMessageBodyDto & { userId: string };

export type TUpdateMessageDto = TUpdateChatMessageBodyDto & { userId: string };

export class GetChatMessagesQuery extends createZodDto(
  infinityQueryParamsSchema,
) {}

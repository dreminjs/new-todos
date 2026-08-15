import { createZodDto } from "nestjs-zod";
import { createChatMessageBodySchema, joinChatRoomBodySchema, TCreateChatMessageBodyDto } from "types";

export class JoinChatRoomDto extends createZodDto(joinChatRoomBodySchema) {}

export class CreateMessageBodyDto extends createZodDto(
  createChatMessageBodySchema,
) {}

export type TCreateMessageDto = TCreateChatMessageBodyDto & { userId: string };

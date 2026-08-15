import { createZodDto } from "nestjs-zod";
import {
  createChatBodySchema,
  infinityQueryParamsSchema,
  type TCreateChatBodyDto,
  updateChatBodySchema,
  type TUpdateChatBodyDto,
} from "types";

export class GetChatsQuery extends createZodDto(infinityQueryParamsSchema) {}

export class CreateChatDto extends createZodDto(createChatBodySchema) {}

export class UpdateChatDto extends createZodDto(updateChatBodySchema) {}

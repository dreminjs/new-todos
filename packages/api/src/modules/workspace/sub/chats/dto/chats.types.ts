import { createZodDto } from "nestjs-zod";
import {
  createChatBodySchema,
  infinityQueryParamsSchema,
  updateChatBodySchema,
} from "types";
import { findWorkspaceChatsPathParams } from "./chats.schemas.js";

export class GetChatsQuery extends createZodDto(infinityQueryParamsSchema) {}

export class CreateChatDto extends createZodDto(createChatBodySchema) {}

export class UpdateChatDto extends createZodDto(updateChatBodySchema) {}

export class FindWorkspaceChatsPathParams extends createZodDto(
  findWorkspaceChatsPathParams,
) {}

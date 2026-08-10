import { createZodDto } from "nestjs-zod";
import {
  actionWorkspaceRequestSchema,
  TWorkspaceRequest,
} from "types";

export class ActionWorkspaceRequestDto extends createZodDto(
  actionWorkspaceRequestSchema
) {}

export type TCreateRequestDto = Pick<TWorkspaceRequest, "userId" | "workspaceId">

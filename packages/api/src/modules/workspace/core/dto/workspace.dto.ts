import { createZodDto } from "nestjs-zod";
import {
  actionWorkspaceInvitationSchema,
  createWorkspaceInvitationSchemaBody,
  createWorkspaceSchema,
  workspaceQueryParamsSchema,
} from "types";

export class CreateWorkspaceDto extends createZodDto(createWorkspaceSchema) {}

export class WorkspaceQueryParamsDto extends createZodDto(workspaceQueryParamsSchema) {}

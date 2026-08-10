import { createZodDto } from "nestjs-zod";
import {
  createWorkspaceInvitationSchemaBody,
  type TCreateWorkspaceInvitationBody,
} from "types";

export class CreateWorkspaceInvitationBodyDto extends createZodDto(
  createWorkspaceInvitationSchemaBody,
) {}

export type TCreateWorkspaceInvitationDto = TCreateWorkspaceInvitationBody & {
  workspaceId: string;
};

import { createZodDto } from "nestjs-zod";
import { createWorkspaceParticipantSchema } from "types";

export class CreateWorkspaceParticipantDto extends createZodDto(
  createWorkspaceParticipantSchema,
) {}

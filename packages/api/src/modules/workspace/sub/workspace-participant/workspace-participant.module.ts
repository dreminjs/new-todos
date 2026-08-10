import { forwardRef, Module } from "@nestjs/common";
import { WorkspaceParticipantService } from "./workspace-participant.service.js";
import { PrismaModule } from "../../../prisma/prisma.module.js";
import { WorkspaceParticipantController } from "./workspace-participant.controller.js";
import { WorkspaceParticipantRepository } from "./workspace-participant.repository.js";
import { WorkspaceModule } from "../../core/workspace.module.js";
import { UserModule } from "../../../user/user.module.js";

@Module({
  imports: [PrismaModule, UserModule, forwardRef(() => WorkspaceModule)],
  controllers: [WorkspaceParticipantController],
  providers: [WorkspaceParticipantService, WorkspaceParticipantRepository],
  exports: [WorkspaceParticipantService, WorkspaceParticipantRepository],
})
export class WorkspaceParticipantModule {}

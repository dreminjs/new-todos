import { forwardRef, Module } from "@nestjs/common";
import { WorkspaceRequestService } from "./workspace-request.service.js";
import { PrismaModule } from "../../../prisma/prisma.module.js";
import { WorkspaceRequestRepository } from "./workspace-request.repository.js";
import { WorkspaceParticipantModule } from "../workspace-participant/workspace-participant.module.js";
import { WorkspaceRequestController } from "./workspace-request.controller.js";
import { WorkspaceModule } from "../../core/workspace.module.js";
@Module({
  imports: [PrismaModule, WorkspaceParticipantModule, forwardRef(() => WorkspaceModule)],
  controllers: [WorkspaceRequestController],
  providers: [WorkspaceRequestService, WorkspaceRequestRepository],
  exports: [WorkspaceRequestService],
})
export class WorkspaceRequestModule {}

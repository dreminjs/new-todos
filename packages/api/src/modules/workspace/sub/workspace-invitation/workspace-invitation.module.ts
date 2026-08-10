
import { Module, forwardRef } from "@nestjs/common";
import { NotificationsModule } from "../../../notifications/notifications.module.js";
import { PrismaModule } from "../../../prisma/prisma.module.js";
import { UserModule } from "../../../user/user.module.js";
import { WorkspaceModule } from "../../core/workspace.module.js";
import { WorkspaceInvitationController } from "./workspace-invitation.controller.js";
import { WorkspaceInvitationRepository } from "./workspace-invitation.repository.js";
import { WorkspaceInvitationService } from "./workspace-invitation.service.js";
import { WorkspaceParticipantModule } from "../workspace-participant/workspace-participant.module.js";


@Module({
  imports: [
    NotificationsModule,
    PrismaModule,
    UserModule,
    WorkspaceParticipantModule,
    forwardRef(() => WorkspaceModule)
  ],
  providers: [WorkspaceInvitationService, WorkspaceInvitationRepository],
  exports: [WorkspaceInvitationService],
  controllers: [WorkspaceInvitationController],
})
export class WorkspaceInvitationModule {
}

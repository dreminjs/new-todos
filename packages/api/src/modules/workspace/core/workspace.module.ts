import { Module } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service.js";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { NotificationsModule } from "../../notifications/notifications.module.js";
import { WorkspaceInvitationModule } from "../sub/workspace-invitation/workspace-invitation.module.js";
import { WorkspaceParticipantModule } from "../sub/workspace-participant/workspace-participant.module.js";
import { WorkspaceRequestModule } from "../sub/workspace-request/workspace-request.module.js";
import { TodoModule } from "../../todo/core/todo.module.js";
import { WorkspaceController } from "./workspace.controller.js";
import { TokenModule } from "../../token/token.module.js";
import { WorkspaceRepository } from "./workspace.repository.js";
import { IsUserWorkspaceParticipantGuard } from "./guards/isUserWorkspaceParticipant.guard.js";
import { IsWorkspaceOwnerGuard } from "./guards/isWorkspaceOwner.guard.js";
import { TodoGroupsModule } from "../../todo/sub/todo-groups/todo-groups.module.js";

@Module({
  imports: [
    PrismaModule,
    NotificationsModule,
    WorkspaceInvitationModule,
    WorkspaceParticipantModule,
    WorkspaceRequestModule,
    TodoModule,
    TokenModule,
    TodoGroupsModule
  ],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    IsWorkspaceOwnerGuard,
    WorkspaceRepository,
    IsUserWorkspaceParticipantGuard,
  ],
  exports: [
    WorkspaceService,
    IsWorkspaceOwnerGuard,
    IsUserWorkspaceParticipantGuard,
    WorkspaceRepository,
  ],
})
export class WorkspaceModule {}

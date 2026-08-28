import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { IExtendedWorkspaceParticipant } from "types";
import { WorkspaceParticipantService } from "./workspace-participant.service.js";
import { AccessTokenGuard } from "../../../token/guards/accees-token.guard.js";
import { WorkspaceRoleGuard } from "../../core/guards/workspace-role.guard.js";
import { MinRole } from "../../core/decorators/min-role.decorator.js";
import { WorkspaceUserRole } from "#generated/enums.js";
import { CurrentUser } from "../../../user/decorators/user.decorator.js";
@UseGuards(AccessTokenGuard)
@Controller("workspaces")
export class WorkspaceParticipantController {
  constructor(
    private workspaceParticipantService: WorkspaceParticipantService,
  ) {}

  @MinRole(WorkspaceUserRole.MEMBER)
  @UseGuards(WorkspaceRoleGuard)
  @Get(":workspaceId/participants")
  async findManyParticipants(
    @Param("workspaceId") workspaceId: string,
  ): Promise<IExtendedWorkspaceParticipant[]> {
    return await this.workspaceParticipantService.findManyByWorkspaceId(
      workspaceId,
    );
  }
  @MinRole(WorkspaceUserRole.MANAGER)
  @UseGuards(WorkspaceRoleGuard)
  @Delete(":workspaceId/participants/:participantId/kick")
  async removeParticipant(
    @Param("workspaceId") workspaceId: string,
    @Param("participantId") participantId: string,
    @CurrentUser("id") kickerId: string,
  ): Promise<void> {
    await this.workspaceParticipantService.kickParticipant({
      workspaceId,
      participantId,
      kickerId,
    });
  }
}

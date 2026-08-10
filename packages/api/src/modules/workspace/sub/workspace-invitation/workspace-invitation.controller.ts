import {
  UseGuards,
  Controller,
  Logger,
  Post,
  Body,
  Get,
  Delete,
  Param,
} from "@nestjs/common";
import { AccessTokenGuard } from "../../../token/guards/accees-token.guard.js";
import { CurrentUser } from "../../../user/decorators/user.decorator.js";
import { WorkspaceInvitationService } from "./workspace-invitation.service.js";
import { TWorkspaceInvitation, TExtendedWorkspaceInvitation, ICreateWorkspaceInvitationResponse } from "types";
import { CreateWorkspaceInvitationBodyDto } from "./dto.js";
import { IsWorkspaceOwnerGuard } from "../../core/guards/isWorkspaceOwner.guard.js";
import { IsUserWorkspaceParticipantGuard } from "../../core/guards/isUserWorkspaceParticipant.guard.js";

@UseGuards(AccessTokenGuard)
@Controller("workspaces")
export class WorkspaceInvitationController {
  constructor(
    private readonly workspaceInvitationService: WorkspaceInvitationService,
  ) { }

  private logger = new Logger(WorkspaceInvitationController.name)

  @UseGuards(IsWorkspaceOwnerGuard, IsUserWorkspaceParticipantGuard)
  @Post("/:workspaceId/invitation")
  async createOne(
    @Body() dto: CreateWorkspaceInvitationBodyDto,
    @Param("workspaceId") workspaceId: string,
  ): Promise<ICreateWorkspaceInvitationResponse> {
    return this.workspaceInvitationService.createOne({ ...dto, workspaceId });
  }

  @Get("invitation")
  async findManyWorkspaceInvitations(
    @CurrentUser("id") userId: string,
  ): Promise<TExtendedWorkspaceInvitation[]> {
    return (await this.workspaceInvitationService.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })) as unknown as TExtendedWorkspaceInvitation[];
  }

  @Post("invitation/:workspaceInvitationId/accept")
  async acceptInvitation(
    @CurrentUser("id") userId: string,
    @Param("workspaceInvitationId") workspaceInvitationId: string,
    @CurrentUser("firstName") firstName: string,
    @CurrentUser("lastName") lastName: string,
  ): Promise<TWorkspaceInvitation> {
    return this.workspaceInvitationService.acceptInvitation(
      workspaceInvitationId,
      userId,
      {
        fullname: `${firstName} ${lastName}`,
      },
    );
  }

  @Delete("invitation/:workspaceInvitationId/reject")
  async rejectInvitation(
    @Param("workspaceInvitationId") workspaceInvitationId: string,
    @CurrentUser("firstName") firstName: string,
    @CurrentUser("lastName") lastName: string,
  ): Promise<void> {
    await this.workspaceInvitationService.rejectInvitation(
      workspaceInvitationId,
      {
        fullname: `${firstName} ${lastName}`,
      },
    );
  }
}

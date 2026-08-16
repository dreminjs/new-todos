import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "../../../token/guards/accees-token.guard.js";
import { CurrentUser } from "../../../user/decorators/user.decorator.js";
import { WorkspaceRequestService } from "./workspace-request.service.js";
import { TWorkspaceParticipant, TWorkspaceRequest } from "types";
import { WorkspaceUserRole } from "#generated/enums.js";
import { WorkspaceRoleGuard } from "../../core/guards/workspace-role.guard.js";
import { MinRole } from "../../core/decorators/min-role.decorator.js";

@UseGuards(AccessTokenGuard)
@Controller("workspace")
export class WorkspaceRequestController {
  constructor(
    private readonly workspaceRequestService: WorkspaceRequestService,
  ) {}

  @Post(":workspaceId/request")
  async create(
    @CurrentUser("firstName") firstName: string,
    @CurrentUser("lastName") lastName: string,
    @CurrentUser("id") userId: string,
    @Param("workspaceId") workspaceId: string,
  ): Promise<TWorkspaceRequest> {
    return await this.workspaceRequestService.create(
      { workspaceId, userId },
      `${firstName} ${lastName}`,
    );
  }

  @Get(":workspaceId/request")
  async findAllByWorkspaceId(
    @Param("workspaceId") workspaceId: string,
  ): Promise<TWorkspaceRequest[]> {
    return await this.workspaceRequestService.findAllByWorkspaceId(workspaceId);
  }

  @MinRole(WorkspaceUserRole.OWNER)
  @UseGuards(WorkspaceRoleGuard)
  @Post(":workspaceId/request/:workspaceRequestId/accept")
  async accept(
    @Param("workspaceId") workspaceId: string,
    @Param("workspaceRequestId") workspaceRequestId: string,
  ): Promise<TWorkspaceParticipant> {
    return await this.workspaceRequestService.accept({
      workspaceId,
      requestId: workspaceRequestId,
    });
  }

  @MinRole(WorkspaceUserRole.OWNER)
  @UseGuards(WorkspaceRoleGuard)
  @Post(":workspaceId/request/:workspaceRequestId/reject")
  async reject(
    @Param("workspaceId") workspaceId: string,
    @Param("workspaceRequestId") workspaceRequestId: string,
  ): Promise<void> {
    return await this.workspaceRequestService.reject({
      workspaceId,
      requestId: workspaceRequestId,
    });
  }
}

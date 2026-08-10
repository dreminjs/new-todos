import {
  UseGuards,
  Controller,
  Logger,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Query,
  Patch,
} from "@nestjs/common";
import { AccessTokenGuard } from "../../token/guards/accees-token.guard.js";
import { CurrentUser } from "../../user/decorators/user.decorator.js";
import {
  CreateWorkspaceDto,
  WorkspaceQueryParamsDto,
} from "./dto/workspace.dto.js";
import { WorkspaceService } from "./workspace.service.js";
import { TTodoGroupResponse, TWorkspace, TWorkspaceInfo } from "types";
import { IsWorkspaceOwnerGuard } from "./guards/isWorkspaceOwner.guard.js";

@UseGuards(AccessTokenGuard)
@Controller("workspaces")
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async createOne(
    @Body() dto: CreateWorkspaceDto,
    @CurrentUser("id") userId: string,
  ): Promise<TWorkspace> {
    return await this.workspaceService.createOne(dto, userId);
  }

  @Get(":workspaceId/info")
  async findWorkspaceInfo(
    @Param("workspaceId") workspaceId: string,
    @CurrentUser("id") userId: string,
  ): Promise<TWorkspaceInfo> {
    return await this.workspaceService.findWorkspaceInfo(workspaceId, userId);
  }

  @Get("my")
  async findManyMyWorkspaces(
    @CurrentUser("id") userId: string,
    @Query() query: WorkspaceQueryParamsDto,
  ): Promise<TWorkspace[]> {
    return this.workspaceService.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      take: query.take,
    });
  }

  @UseGuards(IsWorkspaceOwnerGuard)
  @Delete(":workspaceId/leave")
  async leaveWorkspace(
    @Param("workspaceId") workspaceId: string,
    @CurrentUser("id") userId: string,
  ): Promise<void> {
    await this.workspaceService.leave(workspaceId, userId);
  }
  // TODO: MAKE OTP LOGIC
  @UseGuards(IsWorkspaceOwnerGuard)
  @Patch(":workspaceId/participants/:participantId/transfer-ownership")
  async transferOwnership(
    @Param("workspaceId") workspaceId: string,
    @Param("participantId") participantId: string,
    @CurrentUser("id") userId: string,
  ): Promise<TWorkspace> {
    return await this.workspaceService.transferOwnership(
      workspaceId,
      participantId,
      userId,
    );
  }
  // TODO: MAKE CURSOR PAGINATION
  @UseGuards(IsWorkspaceOwnerGuard)
  @Get(":workspaceId/todo-groups")
  async findWorkspaceTodoGroups(
    @Param("workspaceId") workspaceId: string,
    @CurrentUser("id") userId: string,
  ): Promise<TTodoGroupResponse[]> {
    return await this.workspaceService.findWorkspaceTodoGroups(workspaceId, userId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ChatsService } from "./chats.service.js";
import {
  CreateChatDto,
  FindWorkspaceChatsPathParams,
  UpdateChatDto,
} from "./dto/chats.types.js";
import { AccessTokenGuard } from "../../../token/guards/accees-token.guard.js";
import { WorkspaceRoleGuard } from "../../core/guards/workspace-role.guard.js";
import { MinRole } from "../../core/decorators/min-role.decorator.js";
import { WorkspaceUserRole } from "#generated/enums.js";
@MinRole(WorkspaceUserRole.MANAGER)
@UseGuards(AccessTokenGuard, WorkspaceRoleGuard)
@Controller("/workspaces/:workspaceId/chats")
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}
  @Post()
  async createOne(
    @Body() body: CreateChatDto,
    @Param("workspaceId") workspaceId: string,
  ) {
    return await this.chatsService.create({ ...body, workspaceId });
  }
  @Delete(":id")
  async deleteOne(@Param() pathParamas: FindWorkspaceChatsPathParams) {
    return await this.chatsService.delete(pathParamas);
  }
  @Get(":id")
  async findOne(@Param() pathParamas: FindWorkspaceChatsPathParams) {
    return await this.chatsService.findByIdAndWorkspaceId(pathParamas);
  }
  @Put(":id")
  async updateOne(
    @Param() pathParamas: FindWorkspaceChatsPathParams,
    @Body() body: UpdateChatDto,
  ) {
    return await this.chatsService.update(pathParamas, body);
  }
}

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
import { CreateChatDto, UpdateChatDto } from "./dto/chats.types.js";
import { AccessTokenGuard } from "../../../token/guards/accees-token.guard.js";
import { WorkspaceRoleGuard } from "../../core/guards/workspace-role.guard.js";
import { MinRole } from "../../core/decorators/min-role.decorator.js";
import { WorkspaceUserRole } from "#generated/enums.js";
@MinRole(WorkspaceUserRole.MANAGER)
@UseGuards(WorkspaceRoleGuard)
@UseGuards(AccessTokenGuard)
@Controller("/workspaces/:workspaceId/chats")
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}
  @Post()
  async createOne(@Body() body: CreateChatDto) {
    return await this.chatsService.create(body);
  }
  @Delete(":id")
  async deleteOne(@Param("id") id: string) {
    return await this.chatsService.delete(id);
  }
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.chatsService.findById(id);
  }
  @Put(":id")
  async updateOne(@Param("id") id: string, @Body() body: UpdateChatDto) {
    return await this.chatsService.update(id, body);
  }
}

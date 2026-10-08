import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFiles,
  Req,
  Logger,
} from "@nestjs/common";
import {
  FilesInterceptor,
  UploadedMultipartFile,
} from "@nestjs/platform-fastify/multipart";
import { AccessTokenGuard } from "../../../token/guards/accees-token.guard.js";
import { ChatMessagesService } from "./chat-messages.service.js";
import {
  ChatMessagesPathParams,
  CreateChatMessagePathParams,
  CreateMessageBodyDto,
  GetChatMessagePathParams,
  GetChatMessagesQuery,
  UpdateMessageBodyDto,
} from "./dto/chat-messages.types.js";
import { IItemsResponse, TExtendedChatMessage } from "types";
import { CurrentUser } from "../../../user/decorators/user.decorator.js";
import { WorkspaceRoleGuard } from "../../core/guards/workspace-role.guard.js";
import { MinRole } from "../../core/decorators/min-role.decorator.js";
import { WorkspaceUserRole } from "#generated/enums.js";
import type { Request } from "express";

@MinRole(WorkspaceUserRole.MEMBER)
@UseGuards(AccessTokenGuard, WorkspaceRoleGuard)
@Controller("/workspaces/:workspaceId/chats/:chatId/chat-messages")
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  private logger = new Logger(ChatMessagesController.name)

  @Get()
  async findMany(
    @Param() pathParams: GetChatMessagePathParams,
    @Query() query: GetChatMessagesQuery,
  ): Promise<IItemsResponse<TExtendedChatMessage>> {
    return this.chatMessagesService.findMany(pathParams, query);
  }

  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  async createOne(
    @Param() pathParams: CreateChatMessagePathParams,
    @CurrentUser("id") userId: string,
    @Body() dto: CreateMessageBodyDto,
    @UploadedFiles() files?: Array<UploadedMultipartFile>,
  ) {

    this.logger.log(files)

    return this.chatMessagesService.createOne(
      {
        ...dto,
        userId,
        chatId: pathParams.chatId,
        workspaceId: pathParams.workspaceId,
      },
      files,
    );
  }

  @Delete(":chatMessageId")
  async deleteOne(
    @Param() params: ChatMessagesPathParams,
    @CurrentUser("id") userId: string,
  ) {
    return this.chatMessagesService.deleteOneById(params, userId);
  }

  @Put(":chatMessageId")
  async updateOne(
    @Param() params: ChatMessagesPathParams,
    @Body() dto: UpdateMessageBodyDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.chatMessagesService.updateOne(params, {
      ...dto,
      userId,
    });
  }
}

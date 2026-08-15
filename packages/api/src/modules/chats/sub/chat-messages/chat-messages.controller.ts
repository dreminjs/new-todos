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
} from "@nestjs/common";
import { AccessTokenGuard } from "../../../token/guards/accees-token.guard.js";
import { ChatMessagesService } from "./chat-messages.service.js";
import {
  CreateMessageBodyDto,
  GetChatMessagesQuery,
  UpdateMessageBodyDto,
} from "./dto/chat-messages.types.js";
import { IItemsResponse, TExtendedChatMessage } from "types";
import { CurrentUser } from "../../../user/decorators/user.decorator.js";

@UseGuards(AccessTokenGuard)
@Controller("chat-messages")
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  @Get(":chatId")
  async findMany(
    @Param("chatId") chatId: string,
    @Query() query: GetChatMessagesQuery,
  ): Promise<IItemsResponse<TExtendedChatMessage>> {
    return this.chatMessagesService.findManyByChatId(chatId, query);
  }
  @Post()
  async createOne(
    @CurrentUser("id") userId: string,
    @Body() dto: CreateMessageBodyDto,
  ) {
    return this.chatMessagesService.createOne({ userId, ...dto });
  }

  @Delete(":messageId")
  async deleteOne(@Param("messageId") messageId: string) {
    return this.chatMessagesService.deleteOneById(messageId);
  }

  @Put(":messageId")
  async updateOne(
    @Param("messageId") messageId: string,
    @Body() dto: UpdateMessageBodyDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.chatMessagesService.updateOneById(messageId, {
      ...dto,
      userId,
    });
  }
}

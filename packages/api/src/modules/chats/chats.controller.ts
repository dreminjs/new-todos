import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ChatsService } from "./chats.service.js";
import { CreateChatDto, UpdateChatDto } from "./dto/chats.types.js";
import { AccessTokenGuard } from "../token/guards/accees-token.guard.js";

@UseGuards(AccessTokenGuard)
@Controller("chats")
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

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  CreateTodoGroup,
  UpdateTodoGroup,
} from "./dto/todo-groups.dto.js";
import { TTodoGroup } from "types";
import { TodoGroupsService } from "./todo-groups.service.js";
import { IsTodoGroupOnwerGuard } from "./isTodoGroupOwner.guard.js";
import { CurrentUser } from "../../../user/decorators/user.decorator.js";
import { AccessTokenGuard } from "../../../token/guards/accees-token.guard.js";

@UseGuards(AccessTokenGuard)
@Controller("todo-groups")
export class TodoGroupsController {
  constructor(private readonly todoGroupsService: TodoGroupsService) {}
  @Post()
  async create(
    @Body() dto: CreateTodoGroup,
    @CurrentUser("id") userId: string,
  ): Promise<TTodoGroup> {
    return await this.todoGroupsService.createOne({ ...dto, userId });
  }

  @Get()
  async findMany(
    @CurrentUser("id") userId: string,
  ): Promise<CreateTodoGroup[]> {
    return await this.todoGroupsService.findMany({
      todoGroupParticipants: {
        some: {
          userId,
        },
      },
    });
  }

  @UseGuards(IsTodoGroupOnwerGuard)
  @Delete(":id")
  async deleteOne(@Param("id") id: string): Promise<void> {
    await this.todoGroupsService.deleteOne(id);
  }
  @UseGuards(IsTodoGroupOnwerGuard)
  @Put(":id")
  async updateOne(
    @Param("id") id: string,
    @Body() dto: UpdateTodoGroup,
  ): Promise<TTodoGroup> {
    return await this.todoGroupsService.updateOne(id, dto);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<TTodoGroup | null> {
    return await this.todoGroupsService.findOne({
      where: { id },
    });
  }
}

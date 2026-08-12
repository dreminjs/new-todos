import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  Logger,
  Patch,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { TodoService } from "./todo.service.js";
import { AccessTokenGuard } from "../../token/guards/accees-token.guard.js";
import {
  CreateTodoDto,
  FindMyDayDto,
  UpdateTodoStatusBodyDto,
} from "./dto/todo.dto.js";
import { Todo } from "api/generated/prisma/client.js";
import { FindTodoQueryParamsDto } from "./dto/todo.dto.js";
import { CurrentUser } from "../../user/decorators/user.decorator.js";
import { IItemsResponse, TExtendedTodo } from "types";
import { IsTodoOnwerGuard } from "./isTodoOwner.guard.js";

@UseGuards(AccessTokenGuard)
@Controller("todos")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  private logger = new Logger(TodoController.name);

  @Post()
  async createOne(
    @Body() dto: CreateTodoDto,
    @CurrentUser("id") currentUserId: string,
  ): Promise<TExtendedTodo> {
    return await this.todoService.createOne(dto, currentUserId);
  }

  @Get()
  async findAll(
    @Query() query: FindTodoQueryParamsDto,
  ): Promise<IItemsResponse<TExtendedTodo>> {
    return await this.todoService.findAll(query);
  }

  @Patch("/:id/update-status")
  async updateStatus(
    @CurrentUser("id") userId: string,
    @Param("id") todoId: string,
    @Body() dto: UpdateTodoStatusBodyDto,
  ): Promise<TExtendedTodo | null> {
    return await this.todoService.updateStatus(todoId, {
      status: dto.status,
      userId,
    });
  }

  @Get("my-day")
  async findMyDay(
    @CurrentUser("id") userId: string,
    @Query() query: FindMyDayDto,
  ): Promise<IItemsResponse<TExtendedTodo>> {
    return await this.todoService.findMyDay(userId, query);
  }

  @UseGuards(IsTodoOnwerGuard)
  @Put(":id")
  async updateOne(
    @Param("id") todoId: string,
    @Body() dto: CreateTodoDto,
  ): Promise<TExtendedTodo | null> {
    return await this.todoService.updateOne(todoId, dto);
  }

  @UseGuards(IsTodoOnwerGuard)
  @Delete(":id")
  async deleteOne(@Param("id") todoId: string): Promise<void> {
    await this.todoService.deleteOne(todoId);
  }
}

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
  UpdateTodoStatusDto,
} from "./dto/todo.dto.js";
import { Todo } from "api/generated/prisma/client.js";
import { FindTodoQueryParamsDto } from "./dto/todo.dto.js";
import { CurrentUser } from "../../user/decorators/user.decorator.js";
import { extendedTodoSchema, IItemsResponse, TExtendedTodo } from "types";
import { IsTodoOnwerGuard } from "./isTodoOwner.guard.js";

@UseGuards(AccessTokenGuard)
@Controller("todos")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  private logger = new Logger(TodoController.name);
  @Post("my")
  async createOne(
    @Body() dto: CreateTodoDto,
    @CurrentUser("id") userId: string,
  ): Promise<TExtendedTodo> {
    return await this.todoService.createOne(dto, userId);
  }

  @Get()
  async findAll(
    @Query() query: FindTodoQueryParamsDto,
  ): Promise<IItemsResponse<TExtendedTodo>> {
    this.logger.log(query);
    return await this.todoService.findAll(query);
  }

  @Patch("/:id/update-status")
  async updateStatus(
    @CurrentUser("id") userId: string,
    @Param("id") todoId: string,
    @Body() dto: UpdateTodoStatusDto,
  ): Promise<Todo | null> {
    return await this.todoService.updateStatus(todoId, dto.status);
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
  ): Promise<Todo | null> {
    return await this.todoService.updateOne(todoId, dto);
  }

  @UseGuards(IsTodoOnwerGuard)
  @Delete(":id")
  async deleteOne(@Param("id") todoId: string): Promise<void> {
    await this.todoService.deleteOne(todoId);
  }
}

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import {
  CreateTodoDto,
  FindMyDayDto,
  FindTodoQueryParamsDto,
  TTodoCountInfo,
} from "./dto/todo.dto.js";
import { Prisma, Todo } from "api/generated/prisma/client.js";

import {
  extendedTodoSchema,
  IItemsResponse,
  TExtendedTodo,
  TTodo,
  TTodoStatus,
} from "types";
import { buildInfinityScrollResponse } from "../../../libs/buildInfinityScrollResponse.js";
import { TodoRepository } from "./todo.repository.js";

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async createOne(
    dto: CreateTodoDto,
    currentUserId: string,
  ): Promise<TExtendedTodo> {
    const createdTodo = (await this.todoRepository.create({
      data: {
        ...dto,
        userId: currentUserId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        isMyToday: true,
        createdAt: true,
        updatedAt: true,
        workspace: true,
        todoGroup: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })) as unknown as TExtendedTodo;

    return extendedTodoSchema.parse(createdTodo);
  }

  async findWorkspaceTodosInfo(workspaceId: string): Promise<TTodoCountInfo> {
    const [countAllTodos, countOfCompletedTodos] = await Promise.all([
      this.todoRepository.count({ where: { workspaceId } }),
      this.todoRepository.count({
        where: { workspaceId, status: "COMPLETED" },
      }),
    ]);

    return {
      countAllTodos,
      countOfCompletedTodos,
    };
  }

  async deleteMany(
    args: Prisma.TodoDeleteManyArgs,
  ): Promise<Prisma.BatchPayload> {
    return this.todoRepository.deleteMany(args);
  }

  async getCountOfActiveTodosByTodoGroupId(
    todoGroupId: string,
  ): Promise<number> {
    return this.todoRepository.count({
      where: {
        todoGroupId,
        status: { not: "COMPLETED" },
      },
    });
  }

  async findAll(
    query: FindTodoQueryParamsDto,
  ): Promise<IItemsResponse<TExtendedTodo>> {
    const deadlineFilter = query.deadline
      ? {
          gte: new Date(new Date(query.deadline).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(query.deadline).setHours(23, 59, 59, 999)),
        }
      : undefined;

    const todos = (await this.todoRepository.findMany({
      where: {
        ...(query.workspaceId && { workspaceId: query.workspaceId }),
        ...(query.assignedUserId && { userId: query.assignedUserId }),
        ...(query.todoGroupId && { todoGroupId: query.todoGroupId }),
        ...(query.planned && { deadline: { not: null } }),
        ...(deadlineFilter && { deadline: deadlineFilter }),
        ...(query.priority && { priority: query.priority }),
        ...(query.status && { status: query.status }),
        ...(query.isMyToday && { isMyToday: query.isMyToday }),
      },
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
      take: query.limit + 1,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        status: true,
        isMyToday: true,
        createdAt: true,
        updatedAt: true,
        workspace: true,
        todoGroup: true,
        deadline: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    })) as unknown as TExtendedTodo[];

    return buildInfinityScrollResponse(todos, query.limit);
  }

  async findOne(args: Prisma.TodoFindUniqueArgs): Promise<Todo | null> {
    return this.todoRepository.findOne(args);
  }

  async updateOne(id: string, dto: Prisma.TodoUpdateInput): Promise<Todo> {
    return this.todoRepository.update(id, dto);
  }

  async updateStatus(id: string, status: TTodoStatus): Promise<Todo> {
    return this.updateOne(id, { status });
  }

  async deleteOne(id: string): Promise<Todo> {
    return this.todoRepository.delete(id);
  }

  async findMyDay(
    userId: string,
    query: FindMyDayDto,
  ): Promise<IItemsResponse<TExtendedTodo>> {
    return await this.findAll({ ...query, assignedUserId: userId });
  }
}

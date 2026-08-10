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
  TodoFindFirstArgs,
  TodoUpdateInput,
} from "api/generated/prisma/models.js";
import { IItemsResponse, TExtendedTodo, TTodo, TTodoStatus } from "types";
import { buildInfinityScrollResponse } from "../../../libs/buildInfinityScrollResponse.js";

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async createOne(args: Prisma.TodoCreateArgs) {
    return await this.prisma.todo.create({
      ...args,
    });
  }

  async findAll(userId: string, query: FindTodoQueryParamsDto) {
    const deadlineFilter = query.deadline
      ? {
          gte: new Date(new Date(query.deadline).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(query.deadline).setHours(23, 59, 59, 999)),
        }
      : undefined;

    const todos = await this.prisma.todo.findMany({
      where: {
        // ...(query.workspaceId && { workspaceId: query.workspaceId }),
        // ...(query.assignedUserId && { assignedUserId: query.assignedUserId }),
        // ...(query.assignedMe && { assignedUserId: userId }),
        ...(query.todoGroupId && { todoGroupId: query.todoGroupId }),
        ...(query.planned && { deadline: { not: null } }),
        ...(query.priority && { priority: query.priority }),
        ...(query.status && { status: query.status }),
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
        todoParticipants: {
          select: {
            id: true,
            todoId: true,
            userId: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return buildInfinityScrollResponse(todos, query.limit);
  }

  async findOne(args: TodoFindFirstArgs): Promise<Todo | null> {
    return await this.prisma.todo.findFirst(args);
  }

  async updateOne(id: string, dto: TodoUpdateInput): Promise<Todo | null> {
    return await this.prisma.todo.update({
      where: { id },
      data: dto,
    });
  }

  async updateStatus(id: string, status: TTodoStatus): Promise<Todo | null> {
    return await this.updateOne(id, { status });
  }

  async deleteOne(id: string): Promise<Todo | null> {
    return await this.prisma.todo.delete({
      where: { id },
    });
  }

  async findMyDay(
    userId: string,
    query: FindMyDayDto,
  ): Promise<IItemsResponse<TExtendedTodo>> {
    const todos = await this.prisma.todo.findMany({
      where: {
        todoParticipants: { some: { userId } },
        status: query.status,
        OR: [
          {
            isMyToday: true,
          },
          query.deadline ? { deadline: new Date(query.deadline) } : {},
        ],
      },
      take: query.limit + 1,
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
        todoParticipants: {
          select: {
            id: true,
            todoId: true,
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
        },
      },
    });

    return buildInfinityScrollResponse(todos, query.limit);
  }

  public async findWorkspaceTodosInfo(
    workspaceId: string,
  ): Promise<TTodoCountInfo> {
    const countAllTodosQuery = this.prisma.todo.count({
      where: {
        workspaceId,
      },
    });

    const countOfCompletedTodosQuery = this.prisma.todo.count({
      where: {
        workspaceId,
        status: "COMPLETED",
      },
    });

    const [countAllTodos, countOfCompletedTodos] = await Promise.all([
      countAllTodosQuery,
      countOfCompletedTodosQuery,
    ]);

    return {
      countAllTodos,
      countOfCompletedTodos,
    };
  }

  async deleteMany(
    args: Prisma.TodoDeleteManyArgs,
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.todo.deleteMany({
      ...args,
    });
  }

  async getCountOfActiveTodosByTodoGroupId(
    todoGroupId: string,
  ): Promise<number> {
    return this.prisma.todo.count({
      where: {
        todoGroupId,
        status: {
          not: "COMPLETED",
        },
      },
    });
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import {
  CreateTodoDto,
  FindMyDayDto,
  FindTodoQueryParamsDto,
  TTodoCountInfo,
} from "./dto/todo.dto.js";
import { Prisma, Todo } from "api/generated/prisma/client.js";

import { IItemsResponse, TExtendedTodo } from "types";
import { buildInfinityScrollResponse } from "../../../libs/buildInfinityScrollResponse.js";
import { TodoRepository } from "./todo.repository.js";
import { WorkspaceParticipantService } from "../../workspace/sub/workspace-participant/workspace-participant.service.js";
import { TodoGateway } from "./todo.gateway.js";
import { TUpdateTodoStatusDto } from "./dto/todo.types.js";

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly workspaceParticipantService: WorkspaceParticipantService,
    private readonly todoGateway: TodoGateway,
  ) {}

  private logger = new Logger(TodoService.name);

  async createOne(
    dto: CreateTodoDto,
    currentUserId: string,
  ): Promise<TExtendedTodo> {
    const { workspaceId, assigneeId, ...todoData } = dto;

    if (!workspaceId) {
      if (assigneeId && assigneeId !== currentUserId) {
        throw new BadRequestException(
          "Personal tasks cannot be assigned to other users",
        );
      }

      const result = await this.todoRepository.createExtendedTask(
        dto,
        currentUserId,
      );
      return result as unknown as TExtendedTodo;
    }

    const isCreatorMember = await this.workspaceParticipantService.findOne({
      where: {
        workspaceId,
        userId: currentUserId,
      },
    });
    if (!isCreatorMember) {
      throw new ForbiddenException("You are not a member of this workspace");
    }

    const targetAssigneeId = assigneeId ?? currentUserId;

    if (targetAssigneeId !== currentUserId) {
      const isAssigneeMember = await this.workspaceParticipantService.findOne({
        where: {
          workspaceId,
          userId: targetAssigneeId,
        },
      });
      if (!isAssigneeMember) {
        throw new ForbiddenException(
          "Assignee is not a member of this workspace",
        );
      }
    }

    const result = (await this.todoRepository.createExtendedTask(
      {
        ...todoData,
        workspaceId,
        assigneeId: targetAssigneeId,
      },
      currentUserId,
    )) as unknown as TExtendedTodo;

    if (result.todoGroup?.id && result.workspace?.id) {
      await this.todoGateway.handleTodoAdded(
        { todoGroupId: result.todoGroup.id, workspaceId: result.workspace.id },
        result,
      );
    }

    return result;
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
    userId: string,
    query: FindTodoQueryParamsDto & { isMyToday?: boolean },
  ): Promise<IItemsResponse<TExtendedTodo>> {
    const deadlineFilter = query.deadline
      ? {
          gte: new Date(new Date(query.deadline).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(query.deadline).setHours(23, 59, 59, 999)),
        }
      : undefined;

    const isMyDayRequest = query.isMyToday && deadlineFilter;

    const clientFilters: Prisma.TodoWhereInput = {
      ...(query.assignedUserId && { assigneeId: query.assignedUserId }),
      ...(query.workspaceId && { workspaceId: query.workspaceId }),
      ...(query.todoGroupId && { todoGroupId: query.todoGroupId }),
      ...(query.priority && { priority: query.priority }),
      ...(query.status && { status: query.status }),
      ...(isMyDayRequest
        ? {
            OR: [{ isMyToday: true }, { deadline: deadlineFilter }],
          }
        : {
            ...(query.isMyToday && { isMyToday: query.isMyToday }),
            ...(deadlineFilter && { deadline: deadlineFilter }),
          }),
    };

    const aclFilter: Prisma.TodoWhereInput = {
      OR: [
        { userId },
        { assigneeId: userId },
        {
          workspace: {
            participants: {
              some: { userId },
            },
          },
        },
      ],
    };

    const where: Prisma.TodoWhereInput = {
      AND: [clientFilters, aclFilter],
    };

    const todos = (await this.todoRepository.findMany({
      where,
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
        assignee: {
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

  async updateOne(
    id: string,
    dto: Prisma.TodoUpdateInput,
  ): Promise<TExtendedTodo> {
    return this.todoRepository.update(id, dto);
  }

  async updateStatus(
    id: string,
    dto: TUpdateTodoStatusDto,
  ): Promise<TExtendedTodo> {
    const participantQuery = this.workspaceParticipantService.findOne({
      where: {
        userId: dto.userId,
        workspaceId: dto.workspaceId,
      },
    });

    const todoCandidateQuery = this.findOne({ where: { id } });

    const [participant, todoCandidate] = await Promise.all([
      participantQuery,
      todoCandidateQuery,
    ]);

    if (!todoCandidate) {
      throw new NotFoundException(`Todo not found`);
    }

    if (!participant) {
      throw new ForbiddenException(
        `You are not a participant in this workspace`,
      );
    }

    const isManagerOrOwner = ["OWNER", "MANAGER"].includes(participant.role);
    const isTodoOwner = todoCandidate.userId === dto.userId;

    if (!isManagerOrOwner && !isTodoOwner) {
      throw new ForbiddenException(
        `You are not authorized to update this todo`,
      );
    }

    const updatedTodo = await this.updateOne(id, { status: dto.status });
    if (updatedTodo.workspace?.id) {
      this.todoGateway.handleTodoStatusChanged(updatedTodo);
    }
    return updatedTodo;
  }

  async deleteOne(id: string): Promise<Todo> {
    const deletedTodo = await this.todoRepository.delete(id);
    if (!deletedTodo) {
      throw new NotFoundException(`Todo not found`);
    }
    if (deletedTodo.todoGroupId && deletedTodo.workspaceId) {
      await this.todoGateway.handleTodoDeleted({
        workspaceId: deletedTodo.workspaceId,
        todoGroupId: deletedTodo.todoGroupId,
        status: deletedTodo.status,
        todoId: deletedTodo.id,
      });
    }
    return deletedTodo;
  }

  async findMyDay(
    userId: string,
    query: FindMyDayDto,
  ): Promise<IItemsResponse<TExtendedTodo>> {
    return await this.findAll({
      ...query,
      isMyToday: true,
      assignedUserId: userId,
    });
  }
}

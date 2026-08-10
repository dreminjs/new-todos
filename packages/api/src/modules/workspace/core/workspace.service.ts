import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateWorkspaceDto } from "./dto/workspace.dto.js";
import {
  TTodoGroup,
  TTodoGroupResponse,
  TWorkspace,
  TWorkspaceInfo,
  workspaceSchema,
} from "types";
import { Prisma } from "generated/prisma/client.js";
import { TodoService } from "../../todo/core/todo.service.js";
import { WorkspaceRepository } from "./workspace.repository.js";
import { WorkspaceParticipantRepository } from "../sub/workspace-participant/workspace-participant.repository.js";
import { Transactional } from "@nestjs-cls/transactional";
import { WorkspaceParticipantService } from "../sub/workspace-participant/workspace-participant.service.js";
import { TodoGroupsService } from "../../todo/sub/todo-groups/todo-groups.service.js";

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly todoService: TodoService,
    private readonly workspaceParticipantRepository: WorkspaceParticipantRepository,
    private readonly workspaceParticipantService: WorkspaceParticipantService,
    private readonly todoGroupsService: TodoGroupsService,
  ) {}

  private logger = new Logger(WorkspaceService.name);

  @Transactional()
  async leave(workspaceId: string, userId: string): Promise<void> {
    const workspaceQuery = this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });

    const participantsCountQuery = this.workspaceParticipantService.count({
      where: { workspaceId },
    });

    const [workspace, participantsCount] = await Promise.all([
      workspaceQuery,
      participantsCountQuery,
    ]);

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    if (userId === workspace.id && participantsCount > 1) {
      throw new BadRequestException(
        "Cannot leave workspace as owner and have other participants",
      );
    }

    const deleteParticipantsQuery =
      this.workspaceParticipantRepository.deleteMany({
        where: { workspaceId, userId },
      });

    const deleteTodosQuery = this.todoService.deleteMany({
      where: { workspaceId, userId },
    });

    await Promise.all([deleteParticipantsQuery, deleteTodosQuery]);
  }

  @Transactional()
  async createOne(
    dto: CreateWorkspaceDto,
    userId: string,
  ): Promise<TWorkspace> {
    const workspace = await this.workspaceRepository.create(dto, userId);

    await this.workspaceParticipantRepository.createOne({
      data: {
        workspaceId: workspace.id,
        userId,
        role: "OWNER",
      },
    });

    return workspaceSchema.parse(workspace);
  }

  async findOne(args: Prisma.WorkspaceFindUniqueArgs): Promise<TWorkspace> {
    const workspace = await this.workspaceRepository.findOne(args);
    if (!workspace) {
      throw new NotFoundException("Workspace not found!");
    }
    return workspace;
  }

  async findParticipants(workspaceId: string): Promise<any> {
    return this.workspaceRepository.findParticipants(workspaceId);
  }

  async findMany(args: Prisma.WorkspaceFindManyArgs): Promise<TWorkspace[]> {
    return this.workspaceRepository.findMany(args);
  }
  @Transactional()
  async findWorkspaceInfo(
    workspaceId: string,
    userId: string,
  ): Promise<TWorkspaceInfo> {
    const todosInfoQuery = this.todoService.findWorkspaceTodosInfo(workspaceId);
    const countOfMembersQuery = this.workspaceParticipantRepository.count({
      where: { workspaceId },
    });
    const participantQuery = this.workspaceParticipantRepository.findOne({
      where: { workspaceId, userId },
    });
    const workspaceQuery = this.findOne({ where: { id: workspaceId } });

    const [todosInfo, countOfMembers, workspace, participant] =
      await Promise.all([
        todosInfoQuery,
        countOfMembersQuery,
        workspaceQuery,
        participantQuery,
      ]);

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }
    if (!participant) {
      throw new NotFoundException("Participant not found");
    }

    return {
      todo: todosInfo,
      countOfMembers,
      title: workspace.name,
      description: workspace.description,
      role: participant.role,
    };
  }

  @Transactional()
  async transferOwnership(
    workspaceId: string,
    participantId: string,
    previousOwnerId: string,
  ): Promise<TWorkspace> {
    await this.findOne({ where: { id: workspaceId } });
    const candidateParticipant =
      await this.workspaceParticipantRepository.findOne({
        where: { id: participantId },
      });

    if (!candidateParticipant) {
      throw new NotFoundException("Candidate participant not found");
    }

    const [updatedWorkspace] = await Promise.all([
      this.workspaceRepository.updateOne({
        where: { id: workspaceId },
        data: { ownerId: participantId },
      }),
      this.workspaceParticipantRepository.updateOne({
        where: {
          id: participantId,
          workspaceId,
        },
        data: {
          role: "OWNER",
        },
      }),
      this.workspaceParticipantRepository.updateOne({
        where: { id: previousOwnerId, workspaceId },
        data: { role: "MEMBER" },
      }),
    ]);

    return updatedWorkspace;
  }
  @Transactional()
  async findWorkspaceTodoGroups(
    workspaceId: string,
    userId: string,
  ): Promise<TTodoGroupResponse[]> {
    const todoGroups = (await this.todoGroupsService.findMany(
      {
        workspaceId,
      },
      {
        todoGroupParticipants: {
          where: { userId },
          select: { id: true },
        },
        tasks: {
          where: {
            status: {
              not: "COMPLETED",
            },
          },
        },
      },
    )) as unknown as (TTodoGroup & {
      todoGroupParticipants: { id: string }[];
      tasks: { id: string }[];
    })[];

    this.logger.log(todoGroups);

    return todoGroups.map(({ todoGroupParticipants, tasks, ...group }) => ({
      ...group,
      hasAccess: todoGroupParticipants.length > 0,
      countOfActiveTodos: tasks.length,
    }));
  }

  async findMyWorkspaces(userId: string, take: number): Promise<TWorkspace[]> {
    return this.workspaceRepository.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      take,
    });
  }
}

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateWorkspaceDto } from "./dto/workspace.dto.js";
import {
  TChat,
  TTodoGroup,
  TTodoGroupResponse,
  TWorkspace,
  TWorkspaceInfo,
  workspaceSchema,
} from "types";
import type { Prisma, WorkspaceParticipant } from "generated/prisma/client.js";
import { TodoService } from "../../todo/core/todo.service.js";
import { WorkspaceRepository } from "./workspace.repository.js";
import { WorkspaceParticipantRepository } from "../sub/workspace-participant/workspace-participant.repository.js";
import { Transactional } from "@nestjs-cls/transactional";
import { WorkspaceParticipantService } from "../sub/workspace-participant/workspace-participant.service.js";
import { TodoGroupsService } from "../../todo/sub/todo-groups/todo-groups.service.js";
import { ChatsService } from "../sub/chats/chats.service.js";
import { NotFoundError } from "../../../classes/app.error.js";

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly todoService: TodoService,
    private readonly workspaceParticipantRepository: WorkspaceParticipantRepository,
    private readonly workspaceParticipantService: WorkspaceParticipantService,
    private readonly todoGroupsService: TodoGroupsService,
    private readonly chatsService: ChatsService,
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

    if (userId === workspace.ownerId && participantsCount > 1) {
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

  async findOneById(workspaceId: string): Promise<TWorkspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundError("Workspace not found!");
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
    currentWorkspaceParticipant: WorkspaceParticipant,
  ): Promise<TWorkspaceInfo> {
    const todosInfoQuery = this.todoService.findWorkspaceTodosInfo(workspaceId);
    const countOfMembersQuery = this.workspaceParticipantRepository.count({
      where: { workspaceId },
    });

    const workspaceQuery = this.findOne({ where: { id: workspaceId } });

    const [todosInfo, countOfMembers, workspace] = await Promise.all([
      todosInfoQuery,
      countOfMembersQuery,
      workspaceQuery,
    ]);

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }
    return {
      name: workspace.name,
      todo: todosInfo,
      countOfMembers,
      description: workspace.description,
      role: currentWorkspaceParticipant!.role,
      id: workspace.id,
      ownerId: workspace.ownerId,
    };
  }

  @Transactional()
  async transferOwnership(
    workspaceId: string,
    participantId: string,
    previousOwnerId: string,
  ): Promise<TWorkspace> {
    await this.findOne({ where: { id: workspaceId } });
    const candidateParticipantQuery =
      this.workspaceParticipantRepository.findOne({
        where: { id: participantId },
      });

    const ownerParticipantQuery = this.workspaceParticipantRepository.findOne({
      where: { userId: previousOwnerId },
    });

    const [candidateParticipant, ownerParticipant] = await Promise.all([
      candidateParticipantQuery,
      ownerParticipantQuery,
    ]);

    if (!candidateParticipant) {
      throw new NotFoundException("Candidate participant not found");
    }

    if (!ownerParticipant) {
      throw new NotFoundException("Owner not found");
    }

    const [updatedWorkspace] = await Promise.all([
      this.workspaceRepository.updateOne({
        where: { id: workspaceId },
        data: { ownerId: candidateParticipant.userId },
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
        where: {
          userId: previousOwnerId,
          workspaceId,
          id: ownerParticipant.id,
        },
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
        tasks: {
          where: {
            status: {
              not: "COMPLETED",
            },
          },
        },
      },
    )) as unknown as (TTodoGroup & {
      tasks: { id: string }[];
    })[];

    return todoGroups.map(({ tasks, ...group }) => ({
      ...group,
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

  async findWorkspaceChats(workspaceId: string): Promise<TChat[]> {
    return this.chatsService.findAllByWorkspaceId(workspaceId);
  }
}

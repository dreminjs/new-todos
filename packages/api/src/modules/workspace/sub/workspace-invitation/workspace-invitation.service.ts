import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  ICreateWorkspaceInvitationResponse,
  TWorkspaceInvitation,
  workspaceInvitationSchema,
} from "types";
import { UserService } from "../../../user/user.service.js";
import { Prisma } from "generated/prisma/client.js";
import { WorkspaceParticipantService } from "../workspace-participant/workspace-participant.service.js";
import { WorkspaceInvitationRepository } from "./workspace-invitation.repository.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { WorkspaceService } from "../../core/workspace.service.js";
import type { TCreateWorkspaceInvitationDto } from "./dto.js";
import { SendCreateNotification } from "../../../notifications/dto/notifactions.dto.js";
import { Transactional } from "@nestjs-cls/transactional";

@Injectable()
export class WorkspaceInvitationService {
  constructor(
    private readonly workspaceInvitationRepository: WorkspaceInvitationRepository,
    private readonly userService: UserService,
    private readonly workspaceParticipantService: WorkspaceParticipantService,
    private readonly eventEmitter: EventEmitter2,
    private readonly workspaceService: WorkspaceService,
  ) {}

  @Transactional()
  async createOne(
    dto: TCreateWorkspaceInvitationDto,
  ): Promise<ICreateWorkspaceInvitationResponse> {
    const invitedUser = await this.userService.findOne({
      where: { email: dto.email },
    });
    if (!invitedUser) {
      throw new NotFoundException(`User with email ${dto.email} was not found`);
    }

    const participant = await this.workspaceParticipantService.findOne({
      where: {
        userId: invitedUser.id,
        workspaceId: dto.workspaceId,
      },
    });
    if (participant) {
      throw new ConflictException(
        `User is already a participant of this workspace`,
      );
    }

    const oldWorkspaceInvitation =
      await this.workspaceInvitationRepository.findOne({
        where: {
          userId: invitedUser.id,
        },
      });
    if (oldWorkspaceInvitation) {
      throw new ConflictException(`User is already invited to this workspace`);
    }

    const workspaceInvitation =
      (await this.workspaceInvitationRepository.createOne({
        data: {
          user: {
            connect: {
              email: dto.email,
            },
          },
          workspace: {
            connect: { id: dto.workspaceId },
          },
        },
        select: {
          id: true,
          workspace: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })) as unknown as ICreateWorkspaceInvitationResponse;

    this.eventEmitter.emit("notifications.create", {
      userId: invitedUser.id,
      workspaceInvitationId: workspaceInvitation.id,
      workspaceRequestId: null,
      message: `You have been invited to join ${workspaceInvitation.workspace.name}.`,
    });

    return workspaceInvitation;
  }

  async acceptInvitation(
    workspaceInvitationId: string,
    userId: string,
    { fullname }: { fullname: string },
  ): Promise<TWorkspaceInvitation> {
    const workspaceInvitation = await this.findOne({
      where: {
        id: workspaceInvitationId,
      },
    });
    if (!workspaceInvitation) {
      throw new NotFoundException(`Workspace invitation not found`);
    }

    await this.workspaceParticipantService.createOne({
      data: {
        userId,
        workspaceId: workspaceInvitation.workspaceId,
      },
    });

    await this.workspaceInvitationRepository.deleteOne({
      where: {
        id: workspaceInvitationId,
      },
    });

    const workspace = await this.workspaceService.findOne({
      where: {
        id: workspaceInvitation.workspaceId,
      },
    });

    this.eventEmitter.emit(
      "notifications.create",
      new SendCreateNotification({
        userId: workspace?.ownerId,
        workspaceInvitationId: null,
        workspaceRequestId: null,
        message: `${fullname} accepted your invitation to the ${workspace.name}`,
        workspaceId: null,
      }),
    );
    return workspaceInvitationSchema.parse(workspaceInvitation);
  }

  async rejectInvitation(
    workspaceInvitationId: string,
    { fullname }: { fullname: string },
  ): Promise<TWorkspaceInvitation> {
    const workspaceInvitation = await this.findOne({
      where: {
        id: workspaceInvitationId,
      },
    });
    if (!workspaceInvitation) {
      throw new NotFoundException(`Workspace invitation not found`);
    }

    const workspace = await this.workspaceService.findOne({
      where: {
        id: workspaceInvitation.workspaceId,
      },
    });

    this.eventEmitter.emit(
      "notifications.create",
      new SendCreateNotification({
        userId: workspace?.ownerId,
        workspaceInvitationId: null,
        workspaceRequestId: null,
        workspaceId: null,
        message: `${fullname} rejected your invitation to the workspace`,
      }),
    );

    await this.workspaceInvitationRepository.deleteOne({
      where: {
        id: workspaceInvitationId,
      },
    });

    return workspaceInvitationSchema.parse(workspaceInvitation);
  }

  async findMany(
    args: Prisma.SelectSubset<
      Prisma.WorkspaceInvitationFindManyArgs,
      Prisma.WorkspaceInvitationFindManyArgs
    >,
  ): Promise<
    Prisma.WorkspaceInvitationGetPayload<Prisma.WorkspaceInvitationFindManyArgs>[]
  > {
    return this.workspaceInvitationRepository.findMany(args);
  }

  async findOne(
    args: Prisma.SelectSubset<
      Prisma.WorkspaceInvitationFindFirstArgs,
      Prisma.WorkspaceInvitationFindFirstArgs
    >,
  ) {
    return this.workspaceInvitationRepository.findOne(args);
  }
}

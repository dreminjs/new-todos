import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { WorkspaceParticipantRepository } from "./workspace-participant.repository.js";
import {
  IExtendedWorkspaceParticipant,
  workspaceParticipantSchema,
  TWorkspaceParticipant,
} from "types";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SendCreateNotification } from "../../../notifications/dto/notifactions.dto.js";
import { UserService } from "../../../user/user.service.js";
import { Prisma, WorkspaceParticipant } from "generated/prisma/browser.js";
import { WorkspaceRepository } from "../../core/workspace.repository.js";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class WorkspaceParticipantService {
  constructor(
    private readonly workspaceParticipantRepository: WorkspaceParticipantRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userService: UserService,
  ) {}

  private logger = new Logger(WorkspaceParticipantService.name);

  async createOne(
    args: Prisma.WorkspaceParticipantCreateArgs,
  ): Promise<TWorkspaceParticipant> {
    const participant =
      await this.workspaceParticipantRepository.createOne(args);
    return workspaceParticipantSchema.parse(participant);
  }

  async findManyByWorkspaceId(
    workspaceId: string,
  ): Promise<IExtendedWorkspaceParticipant[]> {
    return this.workspaceParticipantRepository.findManyShortInfoByWorkspaceId(
      workspaceId,
    );
  }
  async findOne(
    args: Prisma.WorkspaceParticipantFindFirstArgs,
  ): Promise<WorkspaceParticipant | null> {
    return this.workspaceParticipantRepository.findOne(args);
  }
  async count(args: Prisma.WorkspaceParticipantCountArgs): Promise<number> {
    return this.workspaceParticipantRepository.count(args);
  }

  async deleteMany(
    args: Prisma.WorkspaceParticipantDeleteManyArgs,
  ): Promise<Prisma.BatchPayload> {
    return this.workspaceParticipantRepository.deleteMany({
      ...args,
    });
  }

  async validateParticipantViaWs(
    workspaceId: string,
    userId: string,
  ): Promise<boolean> {
    const participant = await this.workspaceParticipantRepository.findOne({
      where: {
        workspaceId,
        userId,
      },
    });

    if (!participant) {
      throw new WsException("Participant not found");
    }

    return !!participant;
  }

  async kickParticipant({
    participantId,
    workspaceId,
    kickerId,
  }: {
    workspaceId: string;
    participantId: string;
    kickerId: string;
  }): Promise<void> {
    const foundUserQuery = this.userService.findOne({
      where: {
        workspaceParticipants: {
          some: {
            id: participantId,
          },
        },
      },
    });

    const workspaceQuery = this.workspaceRepository.findOne({
      where: {
        id: workspaceId,
      },
    });

    const [workspace, foundUser] = await Promise.all([
      workspaceQuery,
      foundUserQuery,
    ]);

    if (!workspace) {
      throw new NotFoundException(`Workspace with id ${workspaceId} not found`);
    }

    if (!foundUser) {
      throw new NotFoundException(
        `User with workspace participant id ${participantId} not found`,
      );
    }

    if (foundUser.id === workspace.ownerId) {
      throw new BadRequestException(`Cannot kick the owner of the workspace`);
    }

    if (foundUser.id === kickerId) {
      throw new BadRequestException(`Cannot kick yourself`);
    }

    await this.workspaceParticipantRepository.deleteMany({
      where: {
        workspaceId: workspaceId,
        id: participantId,
      },
    });

    this.eventEmitter.emit(
      "notifications.create",
      new SendCreateNotification({
        userId: foundUser.id,
        message: `You have been kicked from the ${workspace.name} workspace`,
        workspaceId: null,
        workspaceInvitationId: null,
        workspaceRequestId: null,
      }),
    );
  }
}

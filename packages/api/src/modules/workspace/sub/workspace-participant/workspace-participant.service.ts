import { Injectable, Logger } from "@nestjs/common";
import { WorkspaceParticipantRepository } from "./workspace-participant.repository.js";
import {
  IExtendedWorkspaceParticipant,
  workspaceParticipantSchema,
  TWorkspaceParticipant,
} from "types";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SendCreateNotification } from "../../../notifications/dto/notifactions.dto.js";
import { UserService } from "../../../user/user.service.js";
import { NotFoundError } from "rxjs";
import { Prisma, WorkspaceParticipant } from "generated/prisma/browser.js";
import { WorkspaceRepository } from "../../core/workspace.repository.js";

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

  async kickParticipant(
    workspaceId: string,
    participantId: string,
  ): Promise<void> {
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
      throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
    }

    if (!foundUser) {
      throw new NotFoundError(
        `User with workspace participant id ${participantId} not found`,
      );
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

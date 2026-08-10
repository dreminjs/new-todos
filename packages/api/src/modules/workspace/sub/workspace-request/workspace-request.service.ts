import { Injectable, NotFoundException } from "@nestjs/common";
import {
  TWorkspace,
  TWorkspaceRequest,
  TWorkspaceParticipant,
  workspaceSchema,
} from "types";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { WorkspaceRequestRepository } from "./workspace-request.repository.js";
import {
  ActionWorkspaceRequestDto,
  TCreateRequestDto,
} from "./dto/workspace.dto.js";
import { WorkspaceParticipantService } from "../workspace-participant/workspace-participant.service.js";
import { Transactional } from "@nestjs-cls/transactional";


@Injectable()
export class WorkspaceRequestService {
  constructor(
    private readonly workspaceRequestRepository: WorkspaceRequestRepository,
    private readonly worksoaceParticipant: WorkspaceParticipantService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    dto: TCreateRequestDto,
    fullname: string,
  ): Promise<TWorkspaceRequest> {
    const request = await this.workspaceRequestRepository.createOne(dto);

    this.eventEmitter.emit("notifications.create", {
      userId: dto.userId,
      workspaceRequestId: request.id,
      message: `${fullname} has requested to join your workspace.`,
    });

    return request;
  }

  async findAllByWorkspaceId(
    workspaceId: string,
  ): Promise<TWorkspaceRequest[]> {
    return await this.workspaceRequestRepository.findAllByWorkspaceId(
      workspaceId,
    );
  }

  @Transactional()
  async accept(dto: ActionWorkspaceRequestDto): Promise<TWorkspaceParticipant> {
    const request = await this.workspaceRequestRepository.findOneById(
      dto.requestId,
    );

    if (!request) {
      throw new NotFoundException("Not found!");
    }

    const results = await this.eventEmitter.emitAsync(
      "workspace.find-one-by-id",
      request.workspaceId,
    );
    const workspace: TWorkspace = workspaceSchema.parse(results[0]);

    const participant = await this.worksoaceParticipant.createOne({
      data: {
        workspaceId: request.workspaceId,
        userId: request.userId,
      },
    });

    await this.workspaceRequestRepository.deleteOneById(dto.requestId);

    this.eventEmitter.emit("notifications.create", {
      userId: participant.userId,
      workspaceRequestId: request.id,
      message: `You has accepted to ${workspace}!.`,
    });
    return participant;
  }

  @Transactional()
  async reject(dto: ActionWorkspaceRequestDto): Promise<void> {
    const request = await this.workspaceRequestRepository.findOneById(
      dto.requestId,
    );

    if (!request) {
      throw new NotFoundException("Not found!");
    }

    const results = await this.eventEmitter.emitAsync(
      "workspace.find-one-by-id",
      request.workspaceId,
    );
    const workspace: TWorkspace = workspaceSchema.parse(results[0]);
    await this.workspaceRequestRepository.deleteOneById(dto.requestId);

    this.eventEmitter.emit("notifications.create", {
      userId: request.userId,
      message: `You has rejected to ${workspace.name}!.`,
    });
  }
}

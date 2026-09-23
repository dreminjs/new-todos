import { Injectable } from "@nestjs/common";
import { Chat, Prisma } from "generated/prisma/client.js";
import { ChatsRepository } from "./chats.repository.js";
import {
  CreateChatDto,
  FindWorkspaceChatsPathParams,
  TCreateChatDto,
  UpdateChatDto,
} from "./dto/chats.types.js";
import { TJoinChatRoomDto } from "../chat-messages/dto/chat-messages.types.js";
import { WorkspaceParticipantService } from "../workspace-participant/workspace-participant.service.js";
import { NotFoundError } from "../../../../classes/app.error.js";

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly workspaceParticipantService: WorkspaceParticipantService,
  ) {}

  async findAllByWorkspaceId(workspaceId: string): Promise<Chat[]> {
    return this.chatsRepository.findAllByWorkspaceId(workspaceId);
  }

  async findOneById(id: string): Promise<Chat | null> {
    return this.chatsRepository.findOneById(id);
  }

  async findOneByIdAndWorkspaceId(dto: FindWorkspaceChatsPathParams) {
    return this.chatsRepository.findOneByIdAndWorkspaceId(dto);
  }

  async create(data: TCreateChatDto): Promise<Chat> {
    return this.chatsRepository.create({
      name: data.name,
      workspace: {
        connect: { id: data.workspaceId },
      },
    });
  }

  async update(
    dto: FindWorkspaceChatsPathParams,
    data: UpdateChatDto,
  ): Promise<Chat> {
    return this.chatsRepository.update(dto, data);
  }

  async delete(dto: FindWorkspaceChatsPathParams): Promise<Chat> {
    return this.chatsRepository.delete(dto);
  }

  async joinChatRoom(dto: TJoinChatRoomDto) {
    const workspace =
      await this.workspaceParticipantService.findOneByChatIdAndUserId(
        dto.id,
        dto.userId,
      );

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    await this.workspaceParticipantService.validateParticipant(
      workspace.workspaceId,
      dto.userId,
    );
  }
}

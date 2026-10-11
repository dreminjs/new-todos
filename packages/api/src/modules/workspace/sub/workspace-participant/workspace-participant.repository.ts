import { Prisma, WorkspaceParticipant } from "api/generated/prisma/client.js";
import { PrismaService } from "../../../prisma/prisma.service.js";
import {
  IExtendedWorkspaceParticipant,
  TWorkspaceParticipant,
  workspaceParticipantSchema,
} from "types";
import { Injectable } from "@nestjs/common";
import { PUBLIC_USER_SELECT } from "../../../user/index.js";

@Injectable()
export class WorkspaceParticipantRepository {
  constructor(private prisma: PrismaService) {}
  async createOne(
    args: Prisma.WorkspaceParticipantCreateArgs,
  ): Promise<WorkspaceParticipant> {
    return this.prisma.workspaceParticipant.create(args);
  }

  async findMany(
    args: Prisma.WorkspaceParticipantFindManyArgs,
  ): Promise<TWorkspaceParticipant[]> {
    const participants = await this.prisma.workspaceParticipant.findMany(args);
    return participants.map((el) =>
      workspaceParticipantSchema.parse(participants),
    );
  }

  async findManyShortInfoByWorkspaceId(
    workspaceId: string,
  ): Promise<IExtendedWorkspaceParticipant[]> {
    return this.prisma.workspaceParticipant.findMany({
      where: {
        workspaceId,
      },
      select: {
        user: {
          select: PUBLIC_USER_SELECT,
        },
        role: true,
        status: true,
        id: true,
      },
    }) as unknown as IExtendedWorkspaceParticipant[];
  }

  async findOne(
    args: Prisma.WorkspaceParticipantFindFirstArgs,
  ): Promise<WorkspaceParticipant | null> {
    return this.prisma.workspaceParticipant.findFirst(args);
  }
  async count(args: Prisma.WorkspaceParticipantCountArgs): Promise<number> {
    return this.prisma.workspaceParticipant.count(args);
  }

  async updateOne(
    args: Prisma.WorkspaceParticipantUpdateArgs,
  ): Promise<WorkspaceParticipant> {
    return this.prisma.workspaceParticipant.update(args);
  }

  async deleteMany(
    args: Prisma.WorkspaceParticipantDeleteManyArgs,
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.workspaceParticipant.deleteMany({
      ...args,
    });
  }
}

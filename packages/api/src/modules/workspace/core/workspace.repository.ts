import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { CreateWorkspaceDto } from "./dto/workspace.dto.js";
import { Prisma } from "generated/prisma/client.js";
@Injectable()
export class WorkspaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWorkspaceDto, userId: string) {
    return this.prisma.workspace.create({
      data: {
        name: dto.name,
        description: dto.description,
        owner: {
          connect: { id: userId },
        },
      },
    });
  }

  async findOne(args: Prisma.WorkspaceFindUniqueArgs) {
    return this.prisma.workspace.findUnique(args);
  }

  async findMany(args: Prisma.WorkspaceFindManyArgs) {
    return this.prisma.workspace.findMany(args);
  }

  async updateOne(args: Prisma.WorkspaceUpdateArgs) {
    return this.prisma.workspace.update(args);
  }

  async findParticipants(workspaceId: string) {
    return this.prisma.workspaceParticipant.findMany({
      where: { workspaceId },
      select: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
            id: true,
          },
        },
      },
    });
  }
}

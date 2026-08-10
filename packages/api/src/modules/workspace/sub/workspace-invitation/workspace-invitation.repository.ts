
import { Injectable } from '@nestjs/common';
import type { Prisma, WorkspaceInvitation } from 'generated/prisma/client.js';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class WorkspaceInvitationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    args: Prisma.WorkspaceInvitationFindManyArgs,
  ): Promise<WorkspaceInvitation[]> {
    return this.prisma.workspaceInvitation.findMany(args);
  }

  async findOne(
    args: Prisma.WorkspaceInvitationFindFirstArgs,
  ): Promise<WorkspaceInvitation | null> {
    return this.prisma.workspaceInvitation.findFirst(args);
  }

  async createOne(
    args: Prisma.WorkspaceInvitationCreateArgs,
  ) {
    return this.prisma.workspaceInvitation.create(args);
  }

  async deleteOne(
    args: Prisma.WorkspaceInvitationDeleteArgs,
  ): Promise<WorkspaceInvitation> {
    return this.prisma.workspaceInvitation.delete(args);
  }
}

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service.js";
import { TWorkspaceRequest, workspaceRequestSchema } from "types";
import { TCreateRequestDto } from "./dto/workspace.dto.js";

@Injectable()
export class WorkspaceRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOne(
    dto: TCreateRequestDto,
  ): Promise<TWorkspaceRequest> {
    const workspaceRequest = await this.prisma.workspaceRequest.create({
      data: {
        ...dto,
      },
    });

    return workspaceRequestSchema.parse(workspaceRequest);
  }

  async findAllByWorkspaceId(
    workspaceId: string,
  ): Promise<TWorkspaceRequest[]> {
    const workspaceRequests = await this.prisma.workspaceRequest.findMany({
      where: {
        workspaceId,
      },
    });

    return workspaceRequests.map((request) =>
      workspaceRequestSchema.parse(request),
    );
  }

  async deleteOneById(id: string): Promise<void> {
    await this.prisma.workspaceRequest.delete({ where: { id } });
  }

  async findOneById(id: string): Promise<TWorkspaceRequest | null> {
    return this.prisma.workspaceRequest.findFirst({
      where: { id },
    });
  }
}

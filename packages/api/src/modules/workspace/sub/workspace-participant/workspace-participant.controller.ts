import { Controller, Delete, Get, Param } from "@nestjs/common";
import { IExtendedWorkspaceParticipant } from "types";
import { WorkspaceParticipantService } from "./workspace-participant.service.js";

@Controller("workspaces")
export class WorkspaceParticipantController {
  constructor(
    private workspaceParticipantService: WorkspaceParticipantService,
  ) {}
  @Get(":workspaceId/participants")
  async findManyParticipants(
    @Param("workspaceId") workspaceId: string,
  ): Promise<IExtendedWorkspaceParticipant[]> {
    return await this.workspaceParticipantService.findManyByWorkspaceId(
      workspaceId,
    );
  }

  @Delete(":workspaceId/participants/:participantId/kick")
  async removeParticipant(
    @Param("workspaceId") workspaceId: string,
    @Param("participantId") participantId: string,
  ): Promise<void> {
    await this.workspaceParticipantService.kickParticipant(
      workspaceId,
      participantId,
    );
  }
}

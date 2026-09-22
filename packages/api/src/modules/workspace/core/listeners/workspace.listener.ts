import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { WorkspaceRepository } from "../workspace.repository.js";

@Injectable()
export class WorkspaceListener {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  @OnEvent("workspace.find-one-by-id", { async: true })
  async findOneById(id: string) {
    return this.workspaceRepository.findOne({ where: { id } });
  }
}

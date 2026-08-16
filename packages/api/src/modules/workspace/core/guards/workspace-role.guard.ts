import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { MIN_ROLE_KEY } from "../decorators/min-role.decorator.js";
import { hasMinRole } from "../model/workspace-role.enum.js";
import { WorkspaceParticipantService } from "../../sub/workspace-participant/workspace-participant.service.js";

@Injectable()
export class WorkspaceRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly workspaceParticipantService: WorkspaceParticipantService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const minRole = this.reflector.get(MIN_ROLE_KEY, context.getHandler());
    if (!minRole) return true;

    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    const workspaceId = req.params.workspaceId;

    const participant = await this.workspaceParticipantService.findOne({
      where: {
        userId,
        workspaceId,
      },
    });

    if (!participant) throw new ForbiddenException("Not a workspace member");
    if (!hasMinRole(participant.role, minRole)) {
      throw new ForbiddenException(`Requires ${minRole} role or higher`);
    }

    req.workspaceParticipant = participant;
    return true;
  }
}

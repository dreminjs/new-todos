import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { User } from "generated/prisma/browser.js";
import { TUserAuthicatedRequest } from "src/interfaces/request.js";
import { WorkspaceParticipantService } from "../../sub/workspace-participant/workspace-participant.service.js";

@Injectable()
export class IsUserWorkspaceParticipantGuard implements CanActivate {
  constructor(
    private readonly workspaceParticipantService: WorkspaceParticipantService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TUserAuthicatedRequest>();

    const { params, user } = request as {
      params: { workspaceId: string };
      user: User;
    };

    const candidate = await this.workspaceParticipantService.findOne({
      where: {
        userId: user.id,
        workspaceId: params.workspaceId,
      },
    });

    if (!candidate) {
      throw new ForbiddenException(
        "You are not participant of this workspace!",
      );
    }

    if (candidate.role !== "OWNER") {
      throw new ForbiddenException(
        "You do not have the required role to perform this action!",
      );
    }

    return true;
  }
}

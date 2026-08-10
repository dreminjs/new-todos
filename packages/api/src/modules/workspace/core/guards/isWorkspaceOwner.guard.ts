import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { TUserAuthicatedRequest } from "src/interfaces/request.js";

import { User } from "generated/prisma/client.js";
import { WorkspaceService } from "../workspace.service.js";

@Injectable()
export class IsWorkspaceOwnerGuard implements CanActivate {
  constructor(private workspaceService: WorkspaceService) {}

  private logger = new Logger(IsWorkspaceOwnerGuard.name)

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TUserAuthicatedRequest>();

    const { params, user } = request as {
      params: { workspaceId: string };
      user: User
    }

    const workspaceId = params.workspaceId;

    if (!workspaceId) {
      return false;
    }

    const workspace = await this.workspaceService.findOne({
      where: {
        id: workspaceId,
      },
    });

    if (!workspace) {
      return false;
    }

    return user.id === workspace.ownerId;
  }
}

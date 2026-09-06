import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { TUserAuthicatedRequest } from "src/interfaces/request.js";
import { TodoService } from "./todo.service.js";
import { WorkspaceParticipantService } from "../../workspace/sub/workspace-participant/workspace-participant.service.js";

type TParamsWithId = FastifyRequest<{
  Params: { id: string };
}>;

@Injectable()
export class CanEditTodoGuard implements CanActivate {
  constructor(
    private readonly todoService: TodoService,
    private readonly workspaceParticipantService: WorkspaceParticipantService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TParamsWithId>();
    const userId = (request as unknown as TUserAuthicatedRequest).user.id;
    const todoId = request.params.id;

    const currentTodo = await this.todoService.findOne({
      where: { id: todoId },
    });

    if (!todoId) return false;

    if (!userId) return false;

    if (!currentTodo) {
      return false;
    }

    if (currentTodo.userId === userId || currentTodo.assigneeId === userId) {
      return true;
    }

    if (!currentTodo.workspaceId) {
      return false;
    }

    const participant = await this.workspaceParticipantService.findOne({
      where: { workspaceId: currentTodo.workspaceId, userId },
    });

    return participant?.role === "MANAGER" || participant?.role === "OWNER";
  }
}

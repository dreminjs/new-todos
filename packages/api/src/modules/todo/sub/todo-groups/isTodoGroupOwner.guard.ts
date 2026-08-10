import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { TUserAuthicatedRequest } from "../../../../interfaces/request.js";
import { TodoGroupsService } from "./todo-groups.service.js";

type TParamsWithId = FastifyRequest<{
  Params: { id: string };
}>;

@Injectable()
export class IsTodoGroupOnwerGuard implements CanActivate {
  constructor(private readonly todoGroupsService: TodoGroupsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TParamsWithId>();

    const userId = (request as unknown as TUserAuthicatedRequest).user.id;
    const todoId = request.params.id;
    const currentTodoGroup = (await this.todoGroupsService.findOne({
      where: { id: todoId },
      include: {
        todoGroupParticipants: true,
      },
    })) as unknown as { todoGroupParticipants: { userId: string }[] };

    return currentTodoGroup?.todoGroupParticipants.some(
      (p) => p.userId === userId,
    );
  }
}

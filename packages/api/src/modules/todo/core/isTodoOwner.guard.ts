import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { TUserAuthicatedRequest } from "src/interfaces/request.js";
import { TodoService } from "./todo.service.js";
import { TTodoParticipantIdResponse } from "./dto/todo.types.js";

type TParamsWithId = FastifyRequest<{
  Params: { id: string };
}>;

@Injectable()
export class IsTodoOnwerGuard implements CanActivate {
  constructor(private readonly todoService: TodoService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TParamsWithId>();

    const userId = (request as unknown as TUserAuthicatedRequest).user.id;
    const todoId = request.params.id;
    const currentTodo = await this.todoService.findOne({
      where: { id: todoId },
      select: {
        todoParticipants: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })
    // return currentTodo?.todoParticipants.some((p) => p.user.id === userId);
    return true
  }
}

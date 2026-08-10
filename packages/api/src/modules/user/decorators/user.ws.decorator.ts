import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "generated/prisma/client.js";
import { Socket } from "socket.io";

export const CurrentWsUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const client: Socket = ctx.switchToWs().getClient();
    const user: User = client.data.user;
    return data ? user[data] : user;
  },
) as {
  (): ParameterDecorator;
  <K extends keyof User>(field: K): ParameterDecorator;
};

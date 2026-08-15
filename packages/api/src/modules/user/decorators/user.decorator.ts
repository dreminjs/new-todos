import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { TUserAuthicatedRequest } from "api/src/interfaces/request.js";
import { User } from "generated/prisma/client.js";

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as TUserAuthicatedRequest;
    return data ? request.user[data] : request.user;
  },
);

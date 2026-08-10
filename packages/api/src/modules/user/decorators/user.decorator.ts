import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'api/generated/prisma/client.js';
import type { TUserAuthicatedRequest } from 'api/src/interfaces/request.js';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as TUserAuthicatedRequest;
    return data ? request.user[data] : request.user;
  },
);

import { User } from 'api/generated/prisma/client.js';
import { FastifyRequest } from 'fastify';

export type TUserAuthicatedRequest = FastifyRequest & {
  user: User;
};

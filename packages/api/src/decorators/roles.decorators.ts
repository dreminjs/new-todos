import { SetMetadata } from '@nestjs/common';
import { WorkspaceUserRole } from 'generated/prisma/enums.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: WorkspaceUserRole[]) => SetMetadata(ROLES_KEY, roles);

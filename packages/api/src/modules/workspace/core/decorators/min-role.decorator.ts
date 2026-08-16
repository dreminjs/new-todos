import { SetMetadata } from "@nestjs/common";
import { WorkspaceUserRole } from "generated/prisma/enums.js";

export const MIN_ROLE_KEY = "minRole";
export const MinRole = (role: WorkspaceUserRole) =>
  SetMetadata(MIN_ROLE_KEY, role);

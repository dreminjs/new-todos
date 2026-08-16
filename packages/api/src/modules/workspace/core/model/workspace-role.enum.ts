import { WorkspaceUserRole } from "#generated/enums.js";

const ROLE_HIERARCHY: Record<WorkspaceUserRole, number> = {
  [WorkspaceUserRole.OWNER]: 3,
  [WorkspaceUserRole.MANAGER]: 2,
  [WorkspaceUserRole.MEMBER]: 1,
};

export function hasMinRole(
  userRole: WorkspaceUserRole,
  minRole: WorkspaceUserRole,
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole];
}

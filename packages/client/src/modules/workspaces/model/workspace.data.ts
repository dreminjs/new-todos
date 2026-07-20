import type { TWorkspaceRoles } from "types";

export const WORKSPACE_USER_STATUSES = [
  {
    value: "ADMIN",
    label: "Admin",
  },
  {
    value: "MEMBER",
    label: "Member",
  },
] as {
  value: Exclude<TWorkspaceRoles, "OWNER">;
  label: string;
}[];

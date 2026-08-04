import type { TWorkspaceRoles } from "types";

export const WORKSPACE_USER_STATUSES = [
  {
    value: "MANAGER",
    label: "Manager",
  },
  {
    value: "MEMBER",
    label: "Member",
  },
] satisfies {
  value: Exclude<TWorkspaceRoles, "OWNER">;
  label: string;
}[];

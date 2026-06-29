import type { TTodoPriority, TTodoStatus } from "types";

export const TODO_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
  CANCELLED: "cancelled",
};

export const PRIORITY_WEIGHT: Record<TTodoPriority, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};
export const TODO_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as Record<TTodoPriority, TTodoPriority>;

export const COLOR_TODO_PRIORITY = {
  [TODO_PRIORITY.LOW]: "green",
  [TODO_PRIORITY.MEDIUM]: "yellow",
  [TODO_PRIORITY.HIGH]: "red",
} as Record<TTodoPriority, string>;

export const TODO_STATUS_OPTIONS = [
  { value: "PENDING", label: "Todo" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Done" },
  { value: "CANCELLED", label: "Cancelled" },
] as { value: TTodoStatus; label: string }[];

export const TODO_PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
] as { value: TTodoPriority; label: string }[];

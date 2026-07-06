import type { TTodoPriority, TTodoStatus } from "types";
import styles from "../views/TodoItem/TodoItemView.module.css";
import type { TFindAllQuery } from "./todo.interface";
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

export const TODO_PRIORITY_CLASSES = {
  [TODO_PRIORITY.LOW]: styles.TodoItemLowPriority,
  [TODO_PRIORITY.MEDIUM]: styles.TodoItemMediumPriority,
  [TODO_PRIORITY.HIGH]: styles.TodoItemHighPriority,
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

export const TODOS_QUERY_FIELDS = [
  "status",
  "limit",
  "deadline",
  "workspaceId",
  "assignedUserId",
  "priority",
  "todoGroupId",
  "planned",
  "assignedMe",
  "isMyToday",
  "cursor",
] as const;

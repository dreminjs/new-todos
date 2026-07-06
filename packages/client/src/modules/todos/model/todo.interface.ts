import type { findTodosSchema, TTodo, TTodoStatus } from "types";
import { todoFormSchema } from "./todo.schema";
import type z from "zod";

export interface IKanbanColumn {
  title: string;
  // todos: Pick<TTodo, "title" | "completed" | "deadline">[];
}

export interface IStatus {
  label: string;
  value: TTodoStatus;
}

export type TCreateTodo = z.infer<typeof todoFormSchema>;

export interface ICreateTodoContext {
  workspaceId?: TTodo["workspaceId"];
  todoGroupId?: TTodo["todoGroupId"];
  status: TTodoStatus;
  priority?: TTodo["priority"];
  isMyToday?: TTodo["isMyToday"];
}

export type CreateTodoContextKeys = keyof ICreateTodoContext;

export type TFindAllQuery = z.infer<typeof findTodosSchema>;

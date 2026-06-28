import type { findTodosSchema, TTodo, TTodoStatus } from "types";
import { createTodoFormSchema } from "./todo.schema";
import type z from "zod";

export interface IKanbanColumn {
  title: string;
  // todos: Pick<TTodo, "title" | "completed" | "deadline">[];
}

export interface IStatus {
  label: string;
  value: TTodoStatus;
}

export type TCreateTodo = z.infer<typeof createTodoFormSchema>;

export interface ICreateTodoContext {
  isMyToday?: TTodo["isMyToday"];
  workspaceId?: TTodo["workspaceId"];
  todoGroupId?: TTodo["todoGroupId"];
  status: TTodoStatus;
}

export type TCreateTodoContext = keyof ICreateTodoContext;

export type TFindAllQuery = Omit<z.infer<typeof findTodosSchema>, "priority">;

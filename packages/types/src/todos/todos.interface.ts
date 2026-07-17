import { z } from "zod";
import {
  extendedTodoSchema,
  findTodosSchema,
  prioritySchema,
  statusSchema,
  todoSchema,
  updateTodoStatusSchema,
} from "./todos.schema.js";
import { todoCountInfoSchema } from "./todo-count-info.schema.js";

export type TFindTodosQuery = z.infer<typeof findTodosSchema>;

export type TTodo = z.infer<typeof todoSchema>;
export interface ITodoKanbanBoard {
  pending: TTodo[];
  inProgress: TTodo[];
  completed: TTodo[];
  cancelled: TTodo[];
}

export type TTodoStatus = z.infer<typeof statusSchema>;
export type TTodoPriority = z.infer<typeof prioritySchema>;
export type TUpdateTodoStatus = z.infer<typeof updateTodoStatusSchema>;
export type TExtendedTodo = z.infer<typeof extendedTodoSchema>;
export type TTodoCountInfo = z.infer<typeof todoCountInfoSchema>;

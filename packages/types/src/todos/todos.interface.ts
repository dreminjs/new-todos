import { z } from "zod";
import {
  extendedTodoSchema,
  findTodosSchema,
  joinGroupTodosRoomSchema,
  prioritySchema,
  statusSchema,
  todoSchema,
  updateTodoStatusBodySchema,
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
export type TUpdateTodoStatusBody = z.infer<typeof updateTodoStatusBodySchema>;
export type TExtendedTodo = z.infer<typeof extendedTodoSchema>;
export type TTodoCountInfo = z.infer<typeof todoCountInfoSchema>;
export type TJoinGroupTodosRoom = z.infer<typeof joinGroupTodosRoomSchema>;
export interface WsTodoDeletedPayload {
  todoId: string;
  todoGroupId: string;
  workspaceId: string;
  status: TTodoStatus;
}

export interface IChangeTodoStatus {
  status: TTodoStatus;
  todoId: string;
  userId: string;
}

export interface TodoDragPositionPayload {
  todoId: string;
  todoGroupId: string;
  workspaceId: string;
  x: number;
  y: number;
  targetColumnStatus?: TTodoStatus;
}

export interface TodoDragEndPayload {
  todoId: string;
  todoGroupId: string;
  workspaceId: string;
}

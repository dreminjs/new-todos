import * as z from "zod";
import {
  createTodoGroupBodySchema,
  findTodoGroupsSchema,
  todoGroupResponseSchema,
  todoGroupSchema,
  updateTodoGroupBodySchema,
} from "./todo-groups.schema.js";

export type TCreateTodoGroupBody = z.infer<typeof createTodoGroupBodySchema>;

export type TTodoGroup = z.infer<typeof todoGroupSchema>;

export type TUpdateTodoGroupBody = z.infer<typeof updateTodoGroupBodySchema>;

export type TTodoGroupResponse = z.infer<typeof todoGroupResponseSchema>;

export type TFindTodoGroups = z.infer<typeof findTodoGroupsSchema>;

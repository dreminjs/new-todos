import * as z from "zod";
import {
  createTodoGroupSchema,
  todoGroupResponseSchema,
  todoGroupSchema,
  updateTodoGroupSchema,
} from "./todo-groups.schema.js";

export type TCreateTodoGroup = z.infer<typeof createTodoGroupSchema>;

export type TTodoGroup = z.infer<typeof todoGroupSchema>;

export type TUpdateTodoGroup = z.infer<typeof updateTodoGroupSchema>;

export type TTodoGroupResponse = z.infer<typeof todoGroupResponseSchema>;

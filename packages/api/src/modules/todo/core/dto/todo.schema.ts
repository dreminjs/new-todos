import { findTodosSchema, todoSchema } from "types";

import * as z from "zod";

export const createTodoSchema = todoSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    deadline: z.string().datetime().nullable().optional(),
    id: z.string(),
  });

export const updateTodoSchema = createTodoSchema;

export const findMyDayTodosSchema = findTodosSchema.pick({
  deadline: true,
  limit: true,
  status: true,
});

export const todoCountInfoSchema = z.object({
  countAllTodos: z.number(),
  countOfCompletedTodos: z.number(),
});

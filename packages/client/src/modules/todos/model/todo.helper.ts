import { TODOS_QUERY_FIELDS } from "./todo.constants";
import type { TFindAllQuery } from "./todo.interface";

export const getTodosQueryKey = (dto: Partial<TFindAllQuery>) => [
  "todos",
  ...TODOS_QUERY_FIELDS.map((key) => dto?.[key] ?? null),
];

import type { IItemsResponse, TTodo, TUpdateTodoStatus } from "types";
import { instance } from "../../../shared/api/api.instance";
import type { TCreateTodo, TFindAllQuery } from "../model/todo.interface";

export const createOne = async (data: TCreateTodo): Promise<TTodo> => {
  return (await instance.post("/todos", { ...data, id: crypto.randomUUID() }))
    .data;
};

export const updateOne = async (
  data: TCreateTodo,
  id: string,
): Promise<TTodo> => {
  return (await instance.put(`/todos/${id}`, { ...data, id })).data;
};

export const findAll = async (
  query: TFindAllQuery,
  endpoint?: string,
  nextCursor?: string,
): Promise<IItemsResponse<TTodo>> => {
  const { data } = await instance.get(
    "todos" + (endpoint ? `/${endpoint}` : ""),
    {
      params: { ...query, cursor: nextCursor },
    },
  );
  return data;
};

export const updateStatus = async (
  todoId: string,
  data: TUpdateTodoStatus,
): Promise<TTodo> => {
  return (await instance.patch(`/todos/${todoId}/update-status`, data)).data;
};

export const deleteOne = async (todoId: string): Promise<string> => {
  await instance.delete(`/todos/${todoId}`);
  return todoId;
};

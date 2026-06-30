import type { IItemsResponse, TTodo, TUpdateTodoStatus } from "types";
import { instance } from "../../../shared/api/api.instance";
import type { TCreateTodo, TFindAllQuery } from "../model/todo.interface";
import clsx from "clsx";

export const createOne = async (data: TCreateTodo): Promise<TTodo> => {
  return (await instance.post("/todos", data)).data;
};

export const findAll = async (
  query: TFindAllQuery,
  endpoint?: string,
): Promise<IItemsResponse<TTodo>> => {
  const { data } = await instance.get(clsx("/todos", endpoint), {
    params: query,
  });
  return data;
};

export const updateStatus = async (
  todoId: string,
  data: TUpdateTodoStatus,
): Promise<TTodo> => {
  return (await instance.patch(`/todos/${todoId}/update-status`, data)).data;
};

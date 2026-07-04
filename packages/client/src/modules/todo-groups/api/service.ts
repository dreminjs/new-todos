import type { TCreateTodoGroup, TTodoGroup } from "types";
import { instance } from "../../../shared/api/api.instance";

const URL = "todo-groups";

export const findGroups = async (): Promise<TTodoGroup[]> => {
  return (await instance.get(URL)).data;
};

export const createOne = async (
  data: TCreateTodoGroup,
): Promise<TTodoGroup> => {
  return (await instance.post(URL, data)).data;
};

export const deleteOne = async (id: string): Promise<void> => {
  await instance.delete(`${URL}/${id}`);
};

export const updateOne = async (
  id: string,
  data: TCreateTodoGroup,
): Promise<TTodoGroup> => {
  return (await instance.put(`${URL}/${id}`, data)).data;
};

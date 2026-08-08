import type { TCreateTodoGroupBody, TTodoGroup } from "types";
import { instance } from "../../../shared/api/api.instance";

const URL = "todo-groups";

export const findGroups = async (): Promise<TTodoGroup[]> => {
  return (await instance.get(`${URL}`)).data;
};

export const createOne = async (
  data: TCreateTodoGroupBody,
): Promise<TTodoGroup> => {
  return (await instance.post(URL, data)).data;
};

export const deleteOne = async (id: string): Promise<void> => {
  await instance.delete(`${URL}/${id}`);
};

export const updateOne = async (
  data: TCreateTodoGroupBody,
  id: string
): Promise<TTodoGroup> => {
  return (await instance.put(`${URL}/${id}`, { name: data.name })).data;
};

export const findOne = async (id: string): Promise<TTodoGroup | null> => {
  return (await instance.get(`${URL}/${id}`)).data;
};

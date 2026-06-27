import type { TTodoGroup } from "types";
import { instance } from "../../../shared/api/api.instance";

const URL = "todo-groups";

export const findGroups = async (): Promise<TTodoGroup[]> => {
  return (await instance.get(URL)).data;
};

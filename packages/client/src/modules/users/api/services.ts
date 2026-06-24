import { instance } from "../../../shared/api/api.instance";
import type { TUser } from "types";

export const findMe = async (): Promise<TUser> => {
  return (await instance.get("users/me")).data;
};

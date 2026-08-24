import type { TChat, TCreateChatBodyDto } from "types";
import { instance } from "../../../shared/api/api.instance";

const BASE_URL = "chats";

export const createOne = async (data: TCreateChatBodyDto): Promise<TChat> => {
  return (await instance.post(BASE_URL, data)).data;
};

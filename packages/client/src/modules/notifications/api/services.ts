import type { TNotification } from "types";
import { instance } from "../../../shared/api/api.instance";

const BASE_URL = "notifications";

export const findMyNotifications = async (): Promise<TNotification[]> => {
  return (await instance.get(`${BASE_URL}/my`)).data;
};

export const updateReadNotification = async (id: string) => {
  return await instance.patch(`${BASE_URL}/${id}`);
};

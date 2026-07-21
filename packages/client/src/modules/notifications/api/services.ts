import type { TNotification } from "types";
import { instance } from "../../../shared/api/api.instance";

const BASE_URL = "notifications";

export const findMyNotifications = async (): Promise<TNotification[]> => {
  return (await instance.get(`${BASE_URL}/my`))
};

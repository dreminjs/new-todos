import type {
  IItemsResponse,
  TNotification,
  TInfinityQueryParams,
} from "types";
import { instance } from "../../../shared/api/api.instance";

const BASE_URL = "notifications";

export const findMyNotifications = async (
  query: TInfinityQueryParams,
): Promise<IItemsResponse<TNotification>> => {
  return (
    await instance.get(`${BASE_URL}/my`, {
      params: {
        cursor: query.cursor,
        take: query.take,
      },
    })
  ).data;
};

export const updateReadNotification = async (
  id: string,
): Promise<TNotification> => {
  return await instance.patch(`${BASE_URL}/${id}/read`);
};

export const updateUnreadNotificaton = async (
  id: string,
): Promise<TNotification> => {
  return await instance.patch(`${BASE_URL}/${id}/unread`);
};

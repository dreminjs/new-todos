import { instance } from "../../../shared/api/api.instance";
import type { TUpdateUserDto, TUser } from "types";

const BASE_URL = "user" as const;

export const findMe = async (): Promise<TUser> => {
  return (await instance.get(`${BASE_URL}/me`)).data;
};

export const uploadAvatar = async (newAvatar: File): Promise<TUser> => {
  const formData = new FormData();

  formData.append("avatar", newAvatar);

  return (await instance.post(`${BASE_URL}/upload-avatar`, formData)).data;
};

export const removeAvatar = async (): Promise<TUser> => {
  return (await instance.patch(`${BASE_URL}/remove-avatar`)).data;
};

export const updateMe = async (dto: TUpdateUserDto): Promise<TUser> => {
  return await instance.patch(`${BASE_URL}/me`, dto)
}

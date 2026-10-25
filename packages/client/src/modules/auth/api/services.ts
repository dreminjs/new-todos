import type { AxiosResponse } from "axios";
import { instance } from "../../../shared/api/api.instance";
import type { AuthDto, IStandartResponse, SignUpDto } from "types";

const BASE_URL = "auth" as const;

export const signup = async (
  dto: SignUpDto,
): Promise<AxiosResponse<IStandartResponse>> => {
  return await instance.post(`/${BASE_URL}/register`, dto);
};

export const signin = async (
  dto: AuthDto,
): Promise<AxiosResponse<IStandartResponse>> => {
  return await instance.post(`/${BASE_URL}/login`, dto);
};

export const logout = async () => {
  return await instance.delete(`${BASE_URL}/logout`);
};

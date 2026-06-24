import type { AxiosResponse } from "axios";
import { instance } from "../../../shared/api/api.instance";
import type { AuthDto, IStandartResponse, SignUpDto } from "types";

export const signup = async (
  dto: SignUpDto,
): Promise<AxiosResponse<IStandartResponse>> => {
  return await instance.post("/auth/register", dto);
};

export const signin = async (
  dto: AuthDto,
): Promise<AxiosResponse<IStandartResponse>> => {
  return await instance.post("/auth/login", dto);
};

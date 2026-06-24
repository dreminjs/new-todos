import { instance } from "../../../shared/api/api.instance";
import type { SignUpDto } from "types";

export const signup = async (dto: SignUpDto): Promise<any> => {
  return instance.post("/auth/signup", dto);
};

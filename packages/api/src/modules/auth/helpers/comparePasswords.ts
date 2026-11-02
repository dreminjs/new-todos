import { BadRequestError } from "../../../classes/app.error.js";
import { comparePasswords } from "./hash.js";
export async function validatePassword(
  oldPassword: string,
  candidatePassword: string,
) {
  if (!(await comparePasswords(oldPassword, candidatePassword))) {
    throw new BadRequestError("Invalid password");
  }
}

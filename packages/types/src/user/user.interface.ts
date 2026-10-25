import * as z from "zod";
import { checkUsernameAvailableResult, updateUserDtoSchema, usernameQueryParamsSchema, userSchema } from "./user.schema.js";
export type TUser = z.infer<typeof userSchema>;
export type TUpdateUserDto = z.infer<typeof updateUserDtoSchema>
export type TUsernameQueryParams = z.infer<typeof usernameQueryParamsSchema>
export type TCheckUsernameAvailableResult = z.infer<typeof checkUsernameAvailableResult>

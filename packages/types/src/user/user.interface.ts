import * as z from "zod";
import { updateUserDtoSchema, userSchema } from "./user.schema.js";
export type TUser = z.infer<typeof userSchema>;
export type TUpdateUserDto = z.infer<typeof updateUserDtoSchema>

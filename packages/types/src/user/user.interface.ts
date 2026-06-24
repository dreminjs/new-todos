import * as z from "zod";
import { userSchema } from "./user.schema.js";
export type TUser = z.infer<typeof userSchema>;

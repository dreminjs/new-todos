import z from "zod";
import { authSchema, signUpSchema } from "./auth.schema.js";

export type AuthDto = z.infer<typeof authSchema>;
export type SignUpDto = z.infer<typeof signUpSchema>;

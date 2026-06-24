import { z } from "zod";
import { signUpSchema } from "types";

export type TSignupDto = z.infer<typeof signUpSchema>;

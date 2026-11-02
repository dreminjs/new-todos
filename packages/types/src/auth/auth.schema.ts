import * as z from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signUpSchema = authSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
});
export const changePasswordSchema = z.object({
  password: z.string(),
  token: z.uuid()
});

export const requestChangePasswordSchema = changePasswordSchema.omit({
  token: true
});

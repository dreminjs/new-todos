import z from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signUpSchema = authSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
});

import { changePasswordSchema } from "types";

export const changePasswordFormSchema = changePasswordSchema.omit({
  token: true,
});

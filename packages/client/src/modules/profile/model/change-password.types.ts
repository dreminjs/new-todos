import type z from "zod";
import type { changePasswordFormSchema } from "./change-password.schema";


export type TChangePasswordForm = z.infer<typeof changePasswordFormSchema>

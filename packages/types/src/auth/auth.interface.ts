import * as z from "zod";
import {
  authSchema,
  requestChangePasswordSchema,
  signUpSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  verifyCodeSchema,
} from "./auth.schema.js";

export type AuthDto = z.infer<typeof authSchema>;
export type SignUpDto = z.infer<typeof signUpSchema>;
export type TRequestChangePassword = z.infer<
  typeof requestChangePasswordSchema
>;

export type TChangePassword = z.infer<typeof changePasswordSchema>;

export interface IRequestChangePasswordResult {
  token: string;
}

export type TForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

export type TVerifyCodeDto = z.infer<typeof verifyCodeSchema>;

export interface IVerifyForgotPasswordCodeResult {
  token: string;
}

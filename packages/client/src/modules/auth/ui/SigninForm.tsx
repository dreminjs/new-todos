import { AuthFormLayout } from "./AuthFormLayout";
import { AuthField } from "./AuthField/AuthField";
import type { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";
import type { AuthDto } from "types";

export const SigninForm = () => {
  return (
    <AuthFormLayout
      title={"Welcome back"}
      subtitle={"Please enter your details to sign in."}
    >
      <form>
        <AuthField<AuthDto>
          name={"email"}
          register={function <TFieldName extends never = never>(
            name: TFieldName,
            options?: RegisterOptions<unknown, TFieldName>,
          ): UseFormRegisterReturn<TFieldName> {
            console.log("hello");
          }}
          type={"password"}
        />
        <AuthField<AuthDto>
          name={"password"}
          register={function <TFieldName extends never = never>(
            name: TFieldName,
            options?: RegisterOptions<unknown, TFieldName>,
          ): UseFormRegisterReturn<TFieldName> {
            console.log("hello");
          }}
          type={"password"}
        />
      </form>
    </AuthFormLayout>
  );
};

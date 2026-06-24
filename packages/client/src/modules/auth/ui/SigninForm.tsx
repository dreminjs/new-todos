import { AuthFormLayout } from "./AuthFormLayout";
import { AuthField } from "./AuthField/AuthField";
import { useSigninForm } from "../model/hooks/useSigninForm";
import { useSignin } from "../api/queries";
import { AuthSubmit } from "./AuthSubmit";
import type { AuthDto } from "types";
import styles from "./Signin.module.css";

export const SigninForm = () => {
  const { register, handleSubmit, errors } = useSigninForm();

  const { mutate: signin, isPending } = useSignin();

  const onSubmit = (dto: AuthDto) => {
    signin(dto);
  };

  return (
    <AuthFormLayout
      title={"Welcome back"}
      subtitle={"Please enter your details to sign in."}
    >
      <form className={styles.signinForm} onSubmit={handleSubmit(onSubmit)}>
        <AuthField<AuthDto>
          name={"email"}
          register={register}
          type={"email"}
          label={"Email"}
          placeholder={"Enter your email"}
          className={styles.signupFormEmail}
        />
        <AuthField<AuthDto>
          name={"password"}
          register={register}
          type={"password"}
          label={"Password"}
          placeholder={"Enter your password"}
          className={styles.signupFormPassword}
        />
        <AuthSubmit
          label={"Sign in"}
          isLoading={isPending}
          className={styles.signinSubmit}
        />
      </form>
    </AuthFormLayout>
  );
};

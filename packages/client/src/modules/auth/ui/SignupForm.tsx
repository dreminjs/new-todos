import { useSignupForm } from "../model/hooks/useSignupForm";
import { AuthFormLayout } from "./AuthFormLayout";
import { AuthField } from "./AuthField/AuthField";
import { AuthSubmit } from "./AuthSubmit";
import { useSignup } from "../api/queries";
import styles from "./Auth.module.css";
import type { SignUpDto } from "types";

export const SignupForm = () => {
  const { register, errors, handleSubmit } = useSignupForm();

  const { isPending, mutate } = useSignup();

  const onSubmit = async (dto: SignUpDto) => {
    mutate(dto);
  };

  return (
    <AuthFormLayout
      title={"Register"}
      subtitle={"Please enter your details to register."}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
        <AuthField<SignUpDto>
          label={"First Name"}
          name={"firstName"}
          register={register}
          type={"text"}
          error={errors.firstName?.message}
          placeholder={"First name"}
          className={styles.authFormFirstName}
        />
        <AuthField<SignUpDto>
          label={"Last Name"}
          name={"lastName"}
          register={register}
          type={"text"}
          error={errors.lastName?.message}
          placeholder={"Last name"}
          className={styles.authFormLastName}
        />
        <AuthField<SignUpDto>
          label={"Email"}
          name={"email"}
          register={register}
          type={"email"}
          error={errors.email?.message}
          placeholder={"Email"}
          className={styles.authFormEmail}
        />
        <AuthField<SignUpDto>
          label={"Password"}
          name={"password"}
          register={register}
          type={"password"}
          error={errors.password?.message}
          placeholder={"Password"}
          className={styles.authFormPassword}
        />
        <AuthSubmit isLoading={isPending} label={"Sign up"} />
      </form>
    </AuthFormLayout>
  );
};

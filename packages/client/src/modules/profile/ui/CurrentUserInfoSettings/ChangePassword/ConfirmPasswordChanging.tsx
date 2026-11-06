import type { TChangePassword } from "types";
import styles from "./ChangePassword.module.css";
import { FormBottom, FormField } from "../../../../../shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordFormSchema } from "../../../model/change-password.schema";
import type { TChangePasswordForm } from "../../../model/change-password.types";
import type { FC } from "react";

interface IConfirmPasswordChangingProps {
  isLoading: boolean;
  onMutate: (dto: TChangePasswordForm) => void;
}

export const ConfirmPasswordChanging: FC<IConfirmPasswordChangingProps> = ({
  isLoading,
  onMutate,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TChangePasswordForm>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onMutate)}
      className={styles.changePasswordForm}
    >
      <FormField<TChangePasswordForm>
        name={"password"}
        register={register}
        error={errors.password?.message ?? ""}
      />
      <FormBottom isLoading={isLoading} />
    </form>
  );
};

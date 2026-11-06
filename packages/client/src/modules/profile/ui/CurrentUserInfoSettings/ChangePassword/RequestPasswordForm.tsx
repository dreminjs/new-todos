import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  requestChangePasswordSchema,
  type TRequestChangePassword,
} from "types";
import { FormBottom, FormField } from "../../../../../shared";
import type { FC } from "react";
import styles from "./ChangePassword.module.css";
interface IRequestPasswordFormProps {
  isLoading: boolean;
  onMutate: (dto: TRequestChangePassword) => void;
}

export const RequestPasswordForm: FC<IRequestPasswordFormProps> = ({
  isLoading,
  onMutate,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TRequestChangePassword>({
    resolver: zodResolver(requestChangePasswordSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onMutate)}
      className={styles.changePasswordForm}
    >
      <FormField<TRequestChangePassword>
        name={"password"}
        register={register}
        error={errors.password?.message ?? ""}
        label="Password"
      />
      <FormBottom isLoading={isLoading} />
    </form>
  );
};

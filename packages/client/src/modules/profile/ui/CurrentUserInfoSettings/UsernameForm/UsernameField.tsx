import type { UseFormRegister } from "react-hook-form";
import { FormField } from "../../../../../shared";
import type { FC } from "react";
import type { TUsernameQueryParams } from "types";
import styles from "./UsernameForm.module.css";
import { LuCheck, LuX } from "react-icons/lu";
import clsx from "clsx";
interface IUsernameFieldProps {
  register: UseFormRegister<TUsernameQueryParams>;
  error: string;
  available: boolean;
  showIndecator: boolean;
}

export const UsernameField: FC<IUsernameFieldProps> = ({
  register,
  error,
  available,
  showIndecator,
}) => {
  return (
    <div className={styles.usernameField}>
      {showIndecator &&
        (available ? (
          <LuCheck
            className={clsx(styles.usernameStatus, styles.usernameAvailable)}
          />
        ) : (
          <LuX className={clsx(styles.usernameStatus, styles.usernameCancel)} />
        ))}
      <FormField<TUsernameQueryParams>
        name={"username"}
        register={register}
        error={error}
        label="Username"
      />
    </div>
  );
};

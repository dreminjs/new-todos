import type { Path, UseFormRegister } from "react-hook-form";
import styles from "./AuthField.module.css";
import EyePasswordIcon from "../../../../assets/eye-password.svg?react";
import clsx from "clsx";
import { useState } from "react";
interface IAuthFieldProps<T> {
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  type: "password" | "text" | "email";
  label: string;
  placeholder: string;
  className?: string;
}

export function AuthField<T>({
  name,
  register,
  error,
  type,
  label,
  placeholder,
  className,
}: IAuthFieldProps<T>) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(true);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={clsx(styles.authField, className)}>
      <label className={styles.authFieldLabel} htmlFor={name}>
        {label}
      </label>
      <div className={styles.authFieldInner}>
        <input
          placeholder={placeholder}
          {...register(name)}
          id={name}
          type={isPassword && showPassword ? "text" : type}
        />
        {isPassword && (
          <button onClick={handleTogglePassword} type="button">
            <EyePasswordIcon
              className={styles.eyePasswordIcon}
              width={18}
              height={13}
            />
          </button>
        )}
      </div>
      {error && <span className={styles.authFieldError}>{error}</span>}
    </div>
  );
}

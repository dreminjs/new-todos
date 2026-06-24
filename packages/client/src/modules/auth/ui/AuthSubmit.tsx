import type { FC } from "react";
import styles from "./Auth.module.css";
import clsx from "clsx";

interface IAuthSubmit {
  label: string;
  isLoading: boolean;
  className: string;
}

export const AuthSubmit: FC<IAuthSubmit> = ({
  label,
  isLoading,
  className,
}) => {
  return (
    <button
      className={clsx(className, styles.authSubmit)}
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : label}
    </button>
  );
};

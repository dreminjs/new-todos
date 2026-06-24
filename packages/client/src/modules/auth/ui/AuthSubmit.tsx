import type { FC } from "react";
import styles from "./Auth.module.css";
interface IAuthSubmit {
  label: string;
  isLoading: boolean;
}

export const AuthSubmit: FC<IAuthSubmit> = ({ label, isLoading }) => {
  return (
    <button className={styles.authSubmit} type="submit" disabled={isLoading}>
      {isLoading ? "Loading..." : label}
    </button>
  );
};

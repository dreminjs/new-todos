import type { FC } from "react";
import styles from "./Auth.module.css";
interface IAuthSubmit {
  label: string;
}

export const AuthSubmit: FC<IAuthSubmit> = ({ label }) => {
  return (
    <button className={styles.authSubmit} type="submit">
      {label}
    </button>
  );
};

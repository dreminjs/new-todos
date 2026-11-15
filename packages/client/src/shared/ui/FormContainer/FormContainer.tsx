import type { FC } from "react";
import styles from "./FormContainer.module.css";

interface IFormContainerProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export const FormContainer: FC<IFormContainerProps> = ({
  header,
  children,
}) => {
  return (
    <div className={styles.formContainer}>
      <div className={styles.formContainerHeader}>{header}</div>
      <div className={styles.formContainerInner}>{children}</div>
    </div>
  );
};

import type { FC } from "react";
import styles from "./FormContainer.module.css";

interface IFormContainerProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const FormContainer: FC<IFormContainerProps> = ({
  title,
  subtitle,
  icon,
  children,
}) => {
  return (
    <div className={styles.formContainer}>
      <div className={styles.formContainerHeader}>
        <div>
          <h3 className={styles.formContainerTitle}>{title}</h3>
          <h5 className={styles.formContainerSubtitle}>{subtitle}</h5>
        </div>
        {icon}
      </div>
      <div className={styles.formContainerInner}>{children}</div>
    </div>
  );
};

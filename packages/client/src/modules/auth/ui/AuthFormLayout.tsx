import type { ReactNode } from "react";
import { AuthNavigation } from "./AuthNavigation/AuthNavigation";
import styles from "./Auth.module.css";

interface AuthFormLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthFormLayout = ({
  children,
  title,
  subtitle,
}: AuthFormLayoutProps) => {
  return (
    <div className={styles.authFormLayout}>
      <h3 className={styles.authFormLayoutTitle}>{title}</h3>
      <h5 className={styles.authFormLayoutSubtitle}>{subtitle}</h5>
      <AuthNavigation />
      {children}
    </div>
  );
};

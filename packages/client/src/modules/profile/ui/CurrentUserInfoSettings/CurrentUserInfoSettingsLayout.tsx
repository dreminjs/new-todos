import type { FC } from "react";
import styles from "./CurrentUserInfoSettings.module.css";
import clsx from "clsx";
interface ICurrentUserInfoFormLayoutProps {
  children: React.ReactNode;
  isVisible: boolean;
}

export const CurrentUserInfoSettingsLayout: FC<ICurrentUserInfoFormLayoutProps> = ({
  children,
  isVisible,
}) => {
  return (
    <div
      className={clsx(
        styles.currentUserInfoFormLayout,
        isVisible && styles.currentUserInfoFormLayoutActive,
      )}
    >
      <h3>Personal Information</h3>
      <h6>Manage your public information visible across your projects.</h6>
      {children}
    </div>
  );
};

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
      {children}
    </div>
  );
};

import type { FC } from "react";
import styles from "./CurrentUserInfoSettings.module.css";
import clsx from "clsx";
interface ICurrentUserInfoFormLayoutProps {
  children: React.ReactNode;
}

export const CurrentUserInfoSettingsLayout: FC<
  ICurrentUserInfoFormLayoutProps
> = ({ children }) => {
  return (
    <div className={clsx(styles.currentUserInfoFormLayout)}>{children}</div>
  );
};

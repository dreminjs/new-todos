import type { FC } from "react";
import styles from "./ProfilePageWrapper.module.css"


interface IProfilePageWrapperProps {
  children: React.ReactNode;
}

export const ProfilePageWrapper: FC<IProfilePageWrapperProps> = ({
  children,
}) => {
  return <div className={styles.profilePageWrapper}>{children}</div>;
};

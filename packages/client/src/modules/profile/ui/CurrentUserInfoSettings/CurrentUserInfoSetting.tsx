import type { FC } from "react";
import { CurrentUserInfoSettingsLayout } from "./CurrentUserInfoSettingsLayout";
import clsx from "clsx";
import styles from "./CurrentUserInfoSettings.module.css";
interface ICurrentUserInfoSettingsProps {
  isVisible: boolean;
}

export const CurrentUserInfoSettings: FC<ICurrentUserInfoSettingsProps> = ({
  isVisible,
}) => {
  return (
    <div
      className={clsx(
        styles.formWrapper,
        isVisible && styles.formWrapperActive,
      )}
      aria-hidden={!isVisible}
    >
      <CurrentUserInfoSettingsLayout isVisible={isVisible}>
        <div>123  </div>
      </CurrentUserInfoSettingsLayout>
    </div>
  );
};

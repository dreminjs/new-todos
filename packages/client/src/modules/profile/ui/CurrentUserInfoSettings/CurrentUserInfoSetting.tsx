import type { FC } from "react";
import { CurrentUserInfoSettingsLayout } from "./CurrentUserInfoSettingsLayout";
import clsx from "clsx";
import styles from "./CurrentUserInfoSettings.module.css";
import { FullnameForm } from "./FullnameForm/FullnameForm";
import { useGetMe } from "../../../users";
import { UsernameForm } from "./UsernameForm/UsernameForm";
interface ICurrentUserInfoSettingsProps {
  isVisible: boolean;
}

export const CurrentUserInfoSettings: FC<ICurrentUserInfoSettingsProps> = ({
  isVisible,
}) => {
  const { data } = useGetMe();

  return (
    <div
      className={clsx(
        styles.formWrapper,
        isVisible && styles.formWrapperActive,
      )}
      aria-hidden={!isVisible}
    >
      <CurrentUserInfoSettingsLayout isVisible={isVisible}>
        <FullnameForm firstName={data.firstName} lastName={data.lastName} />
        <UsernameForm />
      </CurrentUserInfoSettingsLayout>
    </div>
  );
};

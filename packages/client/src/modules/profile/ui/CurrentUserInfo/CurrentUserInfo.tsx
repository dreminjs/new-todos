import { useState } from "react";
import { GlobalLoadingSpinner } from "../../../../shared";
import { useGetMe } from "../../../users";
import { CurrentUserInfoView } from "./CurrentUserInfoView";
import { ChangeAvatarModal } from "./ChangeAvatarModal/ChangeAvatarModal";
import styles from "./CurrentUserInfo.module.css";
import { CurrentUserInfoSettings } from "../CurrentUserInfoSettings/CurrentUserInfoSetting";
export const UserInfo = () => {
  const [changeAvatarModalVisible, setChangeAvatarModalVisible] =
    useState(false);

  const [isCurrentUserFormVisible, setIsCurrentUserFormVisible] =
    useState(false);

  const { data, isLoading, isError } = useGetMe();

  if (isLoading) return <GlobalLoadingSpinner />;

  if (!data && isError) return <h3>Something went wrong...</h3>;

  return (
    <div className={styles.currentUserInfoContainer}>
      <CurrentUserInfoView
        fullName={`${data.firstName} ${data.lastName}`}
        email={data.email}
        onAvatarClick={() => setChangeAvatarModalVisible(true)}
        avatarUrl={data.avatarUrl}
        username={data.username}
        onEditFullnameClick={() => setIsCurrentUserFormVisible((prev) => !prev)}
      />
      <ChangeAvatarModal
        isOpen={changeAvatarModalVisible}
        onClose={() => setChangeAvatarModalVisible(false)}
        avatarUrl={data.avatarUrl}
      />
      <CurrentUserInfoSettings isVisible={isCurrentUserFormVisible} />
    </div>
  );
};

import { useState } from "react";
import { GlobalLoadingSpinner } from "../../../../shared";
import { useGetMe } from "../../../users";
import { CurrentUserInfoView } from "./CurrentUserInfoView";
import { ChangeAvatarModal } from "./ChangeAvatarModal/ChangeAvatarModal";

export const UserInfo = () => {
  const [changeAvatarModalVisible, setChangeAvatarModalVisible] =
    useState(false);

  const { data, isLoading, isError } = useGetMe();

  if (isLoading) return <GlobalLoadingSpinner />;

  if (!data && isError) return <h3>Something went wrong...</h3>;

  return (
    <>
      <CurrentUserInfoView
        fullName={`${data.firstName} ${data.lastName}`}
        email={data.email}
        onAvatarClick={() => setChangeAvatarModalVisible(true)}
        avatarUrl={data.avatarUrl}
      />
      <ChangeAvatarModal
        isOpen={changeAvatarModalVisible}
        onClose={() => setChangeAvatarModalVisible(false)}
        avatarUrl={data.avatarUrl}
      />
    </>
  );
};

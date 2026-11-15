import type { FC } from "react";
import styles from "./CurrentUserInfo.module.css";
import { getDownloadUrl } from "../../../../shared";
import { LuPen } from "react-icons/lu";
interface ICurrentUserInfoViewProps {
  fullName: string;
  email: string;
  username: string;
  avatarUrl?: string;
  onAvatarClick: () => void;
}

export const CurrentUserInfoView: FC<ICurrentUserInfoViewProps> = ({
  email,
  fullName,
  avatarUrl,
  onAvatarClick,
  username,
}) => {
  return (
    <div className={styles.currentUserInfo}>
      <div className={styles.avatarWrapper}>
        {avatarUrl ? (
          <button onClick={onAvatarClick}>
            <img className={styles.avatarImg} src={getDownloadUrl(avatarUrl)} alt="avatar" />
          </button>
        ) : (
          <button onClick={onAvatarClick} className={styles.avatarFallback}>
            {fullName.at(0)}
          </button>
        )}
      </div>
      <h3 className={styles.currentUserFullname}>{fullName}</h3>
      <h6 className={styles.currentUserEmail}> {email}</h6>
      <h6 className={styles.currentUserUsername}>@{username}</h6>
    </div>
  );
};

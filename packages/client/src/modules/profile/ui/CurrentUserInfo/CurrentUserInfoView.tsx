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
  onEditFullnameClick: () => void
}

export const CurrentUserInfoView: FC<ICurrentUserInfoViewProps> = ({
  email,
  fullName,
  avatarUrl,
  onAvatarClick,
  username,
  onEditFullnameClick
}) => {
  return (
    <div className={styles.currentUserInfo}>
      <div className={styles.avatarWrapper}>
        {avatarUrl ? (
          <button onClick={onAvatarClick}>
            <img src={getDownloadUrl(avatarUrl)} alt="avatar" />
          </button>
        ) : (
          <button onClick={onAvatarClick} className={styles.avatarFallback}>
            {fullName.at(0)}
          </button>
        )}
      </div>
      <div className={styles.currentUserFullname}>
        <h3>{fullName}</h3>
        <button onClick={onEditFullnameClick} className={styles.currentUserFullnameEdit}>
          <LuPen />
        </button>
      </div>
      <h6 className={styles.currentUserEmail}> {email}</h6>
      <h6 className={styles.currentUserUsername}>@{username}</h6>
    </div>
  );
};

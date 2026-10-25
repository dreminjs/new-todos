import type { FC } from "react";
import styles from "./CurrentUserInfo.module.css";
import { getDownloadUrl } from "../../../../shared";
interface ICurrentUserInfoViewProps {
  fullName: string;
  email: string;
  avatarUrl?: string;
  onAvatarClick: () => void;
}

export const CurrentUserInfoView: FC<ICurrentUserInfoViewProps> = ({
  email,
  fullName,
  avatarUrl,
  onAvatarClick,
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
      <div>
        <h3 className={styles.currentUserFullname}>{fullName}</h3>
        <button></button>
      </div>
      <h6 className={styles.currentUserEmail}> {email}</h6>
    </div>
  );
};

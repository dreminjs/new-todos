import { ChangePassword } from "./ChangePassword/ChangePassword";
import styles from "./UserSecurity.module.css";

export const UserSecurity = () => {
  return (
    <div className={styles.userSecurity}>
      <ChangePassword />
    </div>
  );
};

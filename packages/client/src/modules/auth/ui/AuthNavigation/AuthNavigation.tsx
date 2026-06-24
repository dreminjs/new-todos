import { AuthNavigationItem } from "./AuthNavigationItem";
import styles from "./AuthNavigation.module.css";

export const AuthNavigation = () => {
  return (
    <nav className={styles.authNavigation}>
      <ul className={styles.authNavigationList}>
        <AuthNavigationItem to="signin" label="Log in" />
        <AuthNavigationItem to="signup" label="Register" />
      </ul>
    </nav>
  );
};

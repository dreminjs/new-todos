import { useLocation } from "react-router";
import { PROFILE_NAVIGATION_ITEMS } from "../../model/profile-navigation.constants";
import styles from "./ProfileNavigation.module.css";
import { ProfileNavigationItem } from "./ProfileNavigationItem";

export const ProfileNavigation = () => {
  const { pathname } = useLocation();


  return (
    <nav className={styles.navigation}>
      <ul className={styles.navigationList}>
        {PROFILE_NAVIGATION_ITEMS.map((el, idx) => (
          <ProfileNavigationItem
            key={idx}
            label={el.label}
            to={el.to}
            isActive={pathname === el.to}
          />
        ))}
      </ul>
    </nav>
  );
};

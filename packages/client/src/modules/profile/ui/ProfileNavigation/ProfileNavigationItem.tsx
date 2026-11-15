import styles from "./ProfileNavigation.module.css";
import { Link } from "react-router";
import type { FC } from "react";
import clsx from "clsx";

interface IProfileNavigationItem {
  label: string;
  isActive: boolean;
  to: string;
}

export const ProfileNavigationItem: FC<IProfileNavigationItem> = ({
  label,
  isActive,
  to,
}) => {
  return (
    <>
      <li
        className={clsx(
          styles.navigationListItem,
          isActive && styles.navigationListItemActive,
        )}
      >
        <Link to={to}>{label}</Link>
      </li>
    </>
  );
};

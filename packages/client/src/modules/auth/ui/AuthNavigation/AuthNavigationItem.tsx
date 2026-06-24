import { Link, useLocation } from "react-router";
import styles from "./AuthNavigation.module.css";
import clsx from "clsx";

export const AuthNavigationItem = ({
  to,
  label,
}: {
  to: "signin" | "signup";
  label: string;
}) => {
  const isActive = useLocation().pathname.split("/")[2] === to;

  return (
    <li
      className={clsx(
        styles.authNavigationListItem,
        isActive && styles.authNavigationListItemActive,
      )}
    >
      <Link to={`/auth/${to}`}>{label}</Link>
    </li>
  );
};

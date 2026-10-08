import type { FC, ReactNode } from "react";
import { Link } from "react-router";
import styles from "./DashboardCard.module.css";

interface IDashboardCardProps {
  title: string;
  href: string;
  icon?: ReactNode;
  subtitle?: ReactNode;
}

export const DashboardCard: FC<IDashboardCardProps> = ({
  title,
  href,
  icon,
  subtitle,
}) => {
  return (
    <li className={styles.card}>
      <Link to={href} className={styles.link}>
        {icon && <div className={styles.iconWrapper}>{icon}</div>}
        <div className={styles.contentWrapper}>
          <span className={styles.title}>{title}</span>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
      </Link>
    </li>
  );
};

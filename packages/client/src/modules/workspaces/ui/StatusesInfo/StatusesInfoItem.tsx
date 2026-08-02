import type { FC } from "react";

import styles from "./StatusesInfo.module.css";

interface IStatusesInfoItemProps {
  title: string;
  subtitle: string;
}

export const StatusesInfoItem: FC<IStatusesInfoItemProps> = ({
  title,
  subtitle,
}) => {
  return (
    <li>
      <h3 className={styles.statusesInfoItemTitle}>{title}</h3>
      <h5>{subtitle}</h5>
    </li>
  );
};

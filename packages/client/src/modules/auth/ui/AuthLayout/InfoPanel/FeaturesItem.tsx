import type { FC, SVGProps } from "react";

import styles from "./InfoPanel.module.css";

interface IFeaturesItemProps {
  title: string;
  subtitle: string;
  icon: FC<SVGProps<SVGSVGElement>>;
}

export const FeaturesItem: FC<IFeaturesItemProps> = ({
  title,
  subtitle,
  icon: Icon,
}) => {
  return (
    <>
      <li className={styles.featuresItem}>
        <Icon width={36} height={36} />
        <div>
          <h1 className={styles.featuresItemTitle}>{title}</h1>
          <h3 className={styles.featuresItemSubtitle}>{subtitle}</h3>
        </div>
      </li>
    </>
  );
};

import { infoItems } from "../../../model/auth.data";
import { FeaturesItem } from "./FeaturesItem";

import styles from "./InfoPanel.module.css";

export const FeaturesList = () => {
  return (
    <ul className={styles.featuresList}>
      {infoItems.map((item) => (
        <FeaturesItem
          key={item.title}
          title={item.title}
          subtitle={item.subtitle}
          icon={item.icon}
        />
      ))}
    </ul>
  );
};

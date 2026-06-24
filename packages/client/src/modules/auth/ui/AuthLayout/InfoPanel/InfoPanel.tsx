import { FeaturesList } from "./FeaturesList";
import { GreetingTitle } from "./GreetingTitle";
import styles from "./InfoPanel.module.css";
export const InfoPanel = () => {
  return (
    <div className={styles.infoPanel}>
      <GreetingTitle />
      <FeaturesList />
    </div>
  );
};

import styles from "./StatusesInfo.module.css";
import { StatusesInfoItem } from "./StatusesInfoItem";

export const StatusesInfo = () => {
  return (
    <ul className={styles.statusesInfo}>
      <StatusesInfoItem title="Admin" subtitle="Full access" />
      <StatusesInfoItem title="Manager" subtitle="Assign tasks" />
      <StatusesInfoItem
        title="Member"
        subtitle="Complete tasks and create tasks for themself"
      />
    </ul>
  );
};

import type { FC } from "react";
import styles from "./FormHeader.module.css"
interface IFormHeaderProps {
  title: string;
  subtitle: string;
}

export const FormHeader: FC<IFormHeaderProps> = ({ title, subtitle }) => {
  return (
    <>
      <div>
        <h3 className={styles.formHeaderTitle}>{title}</h3>
        <h5 className={styles.formHeaderSubtitle}>{subtitle}</h5>
      </div>
    </>
  );
};

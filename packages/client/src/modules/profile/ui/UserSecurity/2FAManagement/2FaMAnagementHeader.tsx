import { FormHeader } from "../../../../../shared/ui/FormHeader/FormHeader";
import { useGetMe } from "../../../../users";
import styles from "./TwoFAManagement.module.css";

export const TwoFaManagementHeader = () => {
  const {} = useGetMe();
  return (
    <header className={styles.twoFAManagementHeader}>
      <>
        <FormHeader
          title={"2FA Management"}
          subtitle={"Make sing in in your account more security"}
        />
      </>
    </header>
  );
};

import type { UseFormRegister } from "react-hook-form";
import type { TWorkspaceInvitationForm } from "../../model/workspace.types";
import type { FC } from "react";
import styles from "./WorkspaceInvitation.module.css";

interface WorkspaceInvitationFormFieldProps {
  register: UseFormRegister<TWorkspaceInvitationForm>;
}

export const WorkspaceInvitationFormField: FC<
  WorkspaceInvitationFormFieldProps
> = ({ register }) => {
  return (
    <>
      <input
        className={styles.workspaceInvitationInput}
        {...register("email")}
        type="text"
        placeholder="colleague@gmail.com"
      />
    </>
  );
};

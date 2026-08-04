import { Controller, useForm } from "react-hook-form";
import { Button, CustomSelect } from "../../../../shared";
import { WORKSPACE_USER_STATUSES } from "../../model/workspace.data";
import { WorkspaceInvitationFormField } from "./WorkspaceInvitationFormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceInvitationFormSchema } from "../../model/workspace.schema";
import { useInviteMember } from "../../api/queries";
import { useParams } from "react-router";
import type { TWorkspaceInvitationForm } from "../../model/workspace.types";
import styles from "./WorkspaceInvitation.module.css";

export const WorkspaceInvitationForm = () => {
  const { workspaceId } = useParams();

  const { register, handleSubmit, control, watch, reset } =
    useForm<TWorkspaceInvitationForm>({
      resolver: zodResolver(workspaceInvitationFormSchema),
      defaultValues: {
        role: "MEMBER",
      },
    });

  const { mutate } = useInviteMember(workspaceId, {
    onSuccess: () => {
      reset();
    },
    onError: () => {
      reset();
    },
  });

  return (
    <form
      onSubmit={handleSubmit(mutate)}
      className={styles.workspaceInvitationForm}
    >
      <WorkspaceInvitationFormField register={register} />
      <Controller
        control={control}
        name={"role"}
        render={({ field }) => (
          <CustomSelect<TWorkspaceInvitationForm>
            options={WORKSPACE_USER_STATUSES}
            name={"role"}
            className={styles.workspaceInvitationSelect}
            onChange={(value) => field.onChange(value)}
            value={watch("role")}
          />
        )}
      />
      <Button
        type="submit"
        size={"xl"}
        className={styles.workspaceInvitationSubmit}
      >
        Submit
      </Button>
    </form>
  );
};

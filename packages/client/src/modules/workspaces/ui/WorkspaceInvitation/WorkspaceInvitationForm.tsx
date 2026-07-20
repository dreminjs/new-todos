import { Controller, useForm } from "react-hook-form";
import { Button, CustomSelect } from "../../../../shared";
import { WORKSPACE_USER_STATUSES } from "../../model/workspace.data";
import { WorkspaceInvitationFormField } from "./WorkspaceInvitationFormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceInvitationFormSchema } from "../../model/workspace.schema";
import type { TWorkspaceInvitationForm } from "../../model/workspace.types";
import styles from "./WorkspaceInvitation.module.css";
import { useInviteMember } from "../../api/queries";
import { useParams } from "react-router";

export const WorkspaceInvitationForm = () => {
  const { workspaceId } = useParams();

  const { register, handleSubmit, control, watch, reset } =
    useForm<TWorkspaceInvitationForm>({
      resolver: zodResolver(workspaceInvitationFormSchema),
      defaultValues: {
        status: "MEMBER",
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
        name={"status"}
        render={({ field }) => (
          <CustomSelect<TWorkspaceInvitationForm>
            options={WORKSPACE_USER_STATUSES}
            name={"status"}
            className={styles.workspaceInvitationSelect}
            onChange={(value) => field.onChange(value)}
            value={watch("status")}
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

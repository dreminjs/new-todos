import type { FC } from "react";
import { FormBottom, FormField, Modal } from "../../../../../shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceInvitationFormSchema } from "../../../model/workspace.schema";
import type { TWorkspaceInvitationForm } from "../../../model/workspace.types";
import { useInviteMember } from "../../../api/queries";
import styles from "./InviteMember.module.css";

interface IInviteNewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export const InviteNewMemberModal: FC<IInviteNewMemberModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TWorkspaceInvitationForm>({
    resolver: zodResolver(workspaceInvitationFormSchema),
  });

  const { mutate, isPending } = useInviteMember(workspaceId);

  return (
    <Modal title="Invite new Member" isOpen={isOpen} onClose={onClose}>
      <form
        className={styles.inviteNewMemberModal}
        onSubmit={handleSubmit(mutate)}
      >
        <FormField<TWorkspaceInvitationForm>
          register={register}
          name="email"
          error={errors.email?.message}
          label="Email"
        />
        <FormBottom onClose={onClose} isLoading={isPending} />
      </form>
    </Modal>
  );
};

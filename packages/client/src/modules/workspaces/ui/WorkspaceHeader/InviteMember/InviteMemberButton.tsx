import { useState, type FC } from "react";
import { InviteNewMemberModal } from "./InviteNewMemberModal";
import { LuUserPlus } from "react-icons/lu";
import styles from "./InviteMember.module.css";
import { useParams } from "react-router";

export const InviteMemberButton: FC = () => {
  const { workspaceId } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const handleToggleOpen = () => setIsOpen((prev) => !prev);
  return (
    <>
      <button className={styles.invitePersonButton} onClick={handleToggleOpen}>
        <span>Invite Person</span>
        <LuUserPlus />
      </button>
      {isOpen && (
        <InviteNewMemberModal
          workspaceId={workspaceId}
          isOpen={isOpen}
          onClose={handleToggleOpen}
        />
      )}
    </>
  );
};

import { Menu } from "@chakra-ui/react";
import styles from "./WorkspaceMembers.module.css";
import type { FC } from "react";

interface IKickUserButtonProps {
  onClick: () => void;
}

export const KickUserButton: FC<IKickUserButtonProps> = ({ onClick }) => {
  return (
    <Menu.Item value="_">
      <button onClick={onClick} className={styles.kickUserButton}>Kick User</button>
    </Menu.Item>
  );
};

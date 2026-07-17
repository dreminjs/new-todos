import { LuSettings } from "react-icons/lu";
import styles from "./WorkspaceSettings.module.css";
import { useState } from "react";
import { Menu, Portal } from "@chakra-ui/react";

export const WorkspaceSettingsButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Menu.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <Menu.Trigger asChild>
          <button className={styles.workspaceSettingsButton}>
            <LuSettings className={styles.workspaceSettingsSvg} />
          </button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="new-txt">Leave</Menu.Item>

            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  );
};

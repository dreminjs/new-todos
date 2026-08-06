import { Menu, Separator } from "@chakra-ui/react";
import type { FC } from "react";
import { LuEllipsis } from "react-icons/lu";
import { ChangeUserRoleList } from "./ChangeUserRoleList";
import type { TWorkspaceRoles } from "types";
import { KickUserButton } from "./KickUserButton";

interface IWorkspaceMembersDropdownProps {
  userRole: TWorkspaceRoles;
  onKickUser: () => void;
  onTransferOwnership: () => void;
}

export const WorkspaceMembersDropdown: FC<IWorkspaceMembersDropdownProps> = ({
  userRole,
  onKickUser,
  onTransferOwnership,
}) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <button>
          <LuEllipsis />
        </button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <ChangeUserRoleList
            userRole={userRole}
            onTransferOwnership={onTransferOwnership}
          />
          <Separator />
          <KickUserButton onClick={onKickUser} />
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};

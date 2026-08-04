import { Menu } from "@chakra-ui/react";
import type { FC } from "react";
import type { TWorkspaceRoles } from "types";

interface IChangeUserRoleListItemProps {
  currentUserRole: TWorkspaceRoles;
  value: TWorkspaceRoles;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const ChangeUserRoleListItem: FC<IChangeUserRoleListItemProps> = ({
  currentUserRole,
  value,
  onClick,
}) => {
  return (
    <Menu.Item
      onClick={onClick}
      value={value}
      color={currentUserRole === value ? "blue.400" : "gray.400"}
    >
      <button>{value}</button>
    </Menu.Item>
  );
};

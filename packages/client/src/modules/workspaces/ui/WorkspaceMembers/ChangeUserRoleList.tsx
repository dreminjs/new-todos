import { Menu } from "@chakra-ui/react";
import { useCurrentWorkspace } from "../../model/hooks/useCurrentWorkspace";
import { ChangeUserRoleListItem } from "./ChangeUserRoleListItem";
import type { TWorkspaceRoles } from "types";
import type { FC } from "react";

interface IChangeUserRoleListProps {
  userRole: TWorkspaceRoles;
}

export const ChangeUserRoleList: FC<IChangeUserRoleListProps> = ({
  userRole,
}) => {
  return (
    <>
      <Menu.ItemGroup>
        <Menu.ItemGroupLabel
          fontSize="xs"
          color="gray.500"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          Изменить роль
        </Menu.ItemGroupLabel>
        <ChangeUserRoleListItem
          currentUserRole={userRole}
          value={"MANAGER"}
          onClick={function (
            e: React.MouseEvent<HTMLDivElement, MouseEvent>,
          ): void {
            throw new Error("Function not implemented.");
          }}
        />

        <ChangeUserRoleListItem
          currentUserRole={userRole}
          value="MEMBER"
          onClick={function (
            e: React.MouseEvent<HTMLDivElement, MouseEvent>,
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
        <ChangeUserRoleListItem
          currentUserRole={userRole}
          value="OWNER"
          onClick={function (
            e: React.MouseEvent<HTMLDivElement, MouseEvent>,
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
      </Menu.ItemGroup>
    </>
  );
};

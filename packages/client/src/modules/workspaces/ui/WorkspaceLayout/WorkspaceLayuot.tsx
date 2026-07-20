import { Outlet } from "react-router";
import { WorkspaceHeader } from "../WorkspaceHeader/WorkspaceHeader";

export const WorkspaceLayout = () => {
  return (
    <>
      <WorkspaceHeader />
      <Outlet />
    </>
  );
};

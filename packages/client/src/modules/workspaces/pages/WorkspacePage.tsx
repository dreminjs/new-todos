import { useParams } from "react-router";
import { useGetMembershipResult } from "../api/queries";
import { WorkspaceHeader } from "../ui/WorkspaceHeader/WorkspaceHeader";

export const WorkspacePage = () => {
  const { workspaceId } = useParams();

  const { data } = useGetMembershipResult(workspaceId);
  return (
    <>
      <WorkspaceHeader />

    </>
  );
};

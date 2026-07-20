import { useParams } from "react-router";
import { useGetWorkspaceInfo } from "../api/queries";
import { WorkspaceInvitation } from "../ui/WorkspaceInvitation/WorkspaceInvitation";
import { GlobalLoadingSpinner } from "../../../shared";

export const WorkspaceMembersPage = () => {
  const { workspaceId } = useParams();

  const {
    data: workspaceInfo,
    isPending,
    isError,
  } = useGetWorkspaceInfo(workspaceId);

  if (isPending) return <GlobalLoadingSpinner />;

  if (isError || !workspaceInfo) return <div>Error</div>;

  return <>{workspaceInfo?.role === "OWNER" && <WorkspaceInvitation />}</>;
};

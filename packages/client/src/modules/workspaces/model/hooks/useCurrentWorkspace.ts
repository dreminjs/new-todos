import { useParams } from "react-router";
import { useGetWorkspaceInfo } from "../../api/queries";

export const useCurrentWorkspace = () => {
  const { workspaceId } = useParams();

  const {
    data: workspaceInfo,
    isPending,
    isError,
  } = useGetWorkspaceInfo(workspaceId);

  return {
    workspaceInfo,
    isPending,
    isError,
  };
};

import { useParams } from "react-router";
import { useGetMe } from "../../../users";
import { useGetWorkspaceInfo } from "../../../workspaces";

export const useCanUserChangeStatusOfTodo = () => {
  const { workspaceId } = useParams();

  const currentUserId = useGetMe("id").data;
  const { data: workspaceInfo } = useGetWorkspaceInfo(workspaceId);

  const isOwnerOrManager = ["OWNER", "MANAGER"].includes(workspaceInfo?.role);

  return {
    isOwnerOrManager,
    currentUserId,
  };
};

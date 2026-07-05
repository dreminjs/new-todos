import { useQuery } from "@tanstack/react-query";
import { findManyMyWorkspaces, findParticipants } from "./services";

interface UseGetParticipantsProps {
  enable: boolean;
  workspaceId?: string;
}

export const useGetParticipants = ({
  enable,
  workspaceId,
}: UseGetParticipantsProps) => {
  return useQuery({
    queryKey: ["participants"],
    queryFn: findParticipants.bind(null, workspaceId),
    enabled: enable,
  });
};

export const useGetMyWorkspaces = () => {
  return useQuery({
    queryKey: ["my-workspaces"],
    queryFn: findManyMyWorkspaces,
  });
};

import { useQuery } from "@tanstack/react-query";
import { findParticipants } from "./services";

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

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptInvitation,
  // acceptRequest,
  createOne,
  findManyMyWorkspaces,
  findMembership,
  findParticipants,
  findParticipantsByWorkspaceId,
  findWorkspaceInfo,
  inviteMember,
  rejectInvitation,
} from "./services";
import { useNavigate } from "react-router";
import { useSystemNotificationStore } from "../../system-notifications/model/notification.store";
import type {
  // TActionRequestParams,
  TCreateWorkspaceContext,
  TWorkspaceInvitationForm,
} from "../model/workspace.types";
import type {
  TActionWorkspaceInvitation,
  TCreateWorkspace,
  TWorkspace,
} from "types";
import { useGetMe } from "../../users";

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
  return useQuery<TWorkspace[]>({
    queryKey: ["workspaces", "my"],
    queryFn: findManyMyWorkspaces,
  });
};

export const useCreateWorkspace = () => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUserId = useGetMe("id").data;

  return useMutation<
    TWorkspace,
    Error,
    TCreateWorkspace,
    TCreateWorkspaceContext
  >({
    mutationFn: createOne,
    onSuccess: (data, _variables, context) => {
      addNotification({
        message: "Workspace created successfully",
        type: "success",
      });
      navigate(`/workspaces/${data.id}`);

      queryClient.setQueryData<TWorkspace[]>(["workspaces", "my"], (old) => {
        if (!old) return old;
        return old.map((ws) => (ws.id === context?.optimisticId ? data : ws));
      });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["workspaces", "my"] });

      const previousWorkspaces = queryClient.getQueryData<TWorkspace[]>([
        "workspaces",
        "my",
      ]);

      const optimisticWorkspace: TWorkspace = {
        ...variables,
        id: crypto.randomUUID(),
        ownerId: currentUserId,
        code: crypto.randomUUID(),
      };

      queryClient.setQueryData<TWorkspace[]>(["workspaces", "my"], (old) =>
        old ? [...old, optimisticWorkspace] : old,
      );

      return { previousWorkspaces, optimisticId: optimisticWorkspace.id };
    },

    onError: () => {
      addNotification({
        message: "Failed to create workspace",
        type: "error",
      });
    },
  });
};

export const useGetMembershipResult = (workspaceId: string) => {
  return useQuery({
    queryKey: ["membership", workspaceId],
    queryFn: findMembership.bind(null, workspaceId),
    enabled: !!workspaceId,
  });
};

export const useInviteMember = (
  workspaceId: string,
  callbacks: {
    onSuccess?: () => void;
    onError?: () => void;
  },
) => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  const workspaceInfo = useGetWorkspaceInfo(workspaceId);

  const { mutate, ...rest } = useMutation({
    mutationFn: inviteMember,
    onSuccess: () => {
      addNotification({
        message: "Member invited successfully",
        type: "success",
      });
      callbacks?.onSuccess();
    },
    onError: () => {
      addNotification({
        message: "Failed to invite member",
        type: "error",
      });
      callbacks?.onError();
    },
  });

  const handleInviteMember = (data: TWorkspaceInvitationForm) => {
    mutate({ ...data, workspaceId, workspaceName: workspaceInfo.data.title });
  };

  return { mutate: handleInviteMember, ...rest };
};

export const useAcceptInvitation = () => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  const client = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => {
      addNotification({
        message: "Invitation accepted successfully",
        type: "success",
      });
      client.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
    onError: () => {
      addNotification({
        message: "Failed to accept invitation",
        type: "error",
      });
    },
  });

  const handleAcceptInvitation = (dto: TActionWorkspaceInvitation) => {
    mutate(dto);
  };

  return { mutate: handleAcceptInvitation, ...rest };
};

export const useRejectInvitation = () => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  const client = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: rejectInvitation,
    onMutate: () => {
      client.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
    onSuccess: () => {
      addNotification({
        message: "Invitation rejected successfully",
        type: "success",
      });
    },
    onError: (data) => {
      addNotification({
        message: "Failed to reject invitation: " + data?.message,
        type: "error",
      });
    },
  });

  const handleRejectInvitation = (
    dto: Omit<TActionWorkspaceInvitation, "workspaceId">,
  ) => {
    mutate(dto);
  };

  return { mutate: handleRejectInvitation, ...rest };
};

export const useGetWorkspaceInfo = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspaces", workspaceId, "info"],
    queryFn: () => findWorkspaceInfo(workspaceId),
  });
};

// export const useAcceptRequest = () => {
//   const addNotification = useSystemNotificationStore(
//     (state) => state.addNotification,
//   );
//   const client = useQueryClient();
//   return useMutation({
//     mutationFn: (params: TActionRequestParams) =>
//       acceptRequest({
//         workspaceId: params.workspaceId,
//         requestId: params.requestId,
//       }),
//   });
// };

export const useGetParticipantsByWorkspaceId = (workspaceId: string) => {
  return useQuery({
    queryFn: () => findParticipantsByWorkspaceId(workspaceId),
    queryKey: ["workspaces", workspaceId, "participants"],
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptInvitation,
  createOne,
  findManyMyWorkspaceInvitations,
  findManyMyWorkspaces,
  findMembership,
  findParticipants,
  findWorkspaceInfo,
  inviteMember,
  rejectInvitation,
} from "./services";
import { useNavigate } from "react-router";
import { useSystemNotificationStore } from "../../system-notifications/model/notification.store";
import type { TWorkspaceInvitationForm } from "../model/workspace.types";

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
    queryKey: ["workspaces"],
    queryFn: findManyMyWorkspaces,
  });
};

export const useCreateWorkspace = () => {
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOne,
    onSuccess: (data) => {
      addNotification({
        message: "Workspace created successfully",
        type: "success",
      });
      navigate(`/workspaces/${data.id}  `);
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
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
    mutate({ ...data, workspaceId });
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
      // client.invalidateQueries({
      //   queryKey: ["notifications", "invitations"],
      // });
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

  const handleAcceptInvitation = (invitationId: string) => {
    mutate({ invitationId });
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
    onSuccess: () => {
      addNotification({
        message: "Invitation rejected successfully",
        type: "success",
      });
      client.invalidateQueries({
        queryKey: ["workspaces", "invitations"],
      });
      client.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
    onError: (data) => {
      addNotification({
        message: "Failed to reject invitation: " + data?.message,
        type: "error",
      });
    },
  });

  const handleRejectInvitation = (invitationId: string) => {
    mutate({ invitationId });
  };

  return { mutate: handleRejectInvitation, ...rest };
};

export const useGetWorkspaceInfo = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspaces", workspaceId, "info"],
    queryFn: () => findWorkspaceInfo(workspaceId),
  });
};

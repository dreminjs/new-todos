import {
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  acceptInvitation,
  // acceptRequest,
  createOne,
  findManyMyWorkspaces,
  findMembership,
  findParticipants,
  findParticipantsByWorkspaceId,
  findWorkspaceInfo,
  findWorkspaceTodoGroups,
  inviteMember,
  kickParticipant,
  rejectInvitation,
  transferOwnership,
} from "./services";
import { useNavigate } from "react-router";
import { useSystemNotificationStore } from "../../system-notifications/model/notification.store";
import type {
  // TActionRequestParams,
  TCreateWorkspaceContext,
  TWorkspaceInvitationForm,
} from "../model/workspace.types";
import type {
  IExtendedWorkspaceParticipant,
  IItemsResponse,
  TActionWorkspaceInvitation,
  TCreateWorkspace,
  TNotification,
  TWorkspace,
} from "types";
import { useGetMe } from "../../users";

export const useGetMyWorkspaces = ({ take }: { take?: number } = {}) => {
  return useQuery<TWorkspace[]>({
    queryKey: ["workspaces", "my"],
    queryFn: () => findManyMyWorkspaces({ take }),
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

  const { mutate, ...rest } = useMutation({
    mutationFn: inviteMember,
    onSuccess: () => {
      addNotification({
        message: "Member invited successfully",
        type: "success",
      });
      callbacks?.onSuccess();
    },
    onError: (_errs) => {
      addNotification({
        message: "Failed to invite member: " + _errs.message,
        type: "error",
      });
      callbacks?.onError();
    },
  });

  const handleInviteMember = (data: TWorkspaceInvitationForm) => {
    mutate({ ...data, workspaceId, email: data.email, role: data.role });
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
    onMutate: async (dto) => {
      await client.cancelQueries({ queryKey: ["notifications"] });

      const oldNotifications = client.getQueryData<
        InfiniteData<IItemsResponse<TNotification>>
      >(["notifications"]);

      client.setQueryData<InfiniteData<IItemsResponse<TNotification>>>(
        ["notifications"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter(
                (el) => el.workspaceInvitationId !== dto.invitationId,
              ),
            })),
          };
        },
      );

      return { previousData: oldNotifications };
    },
    onSuccess: (dto) => {
      addNotification({
        message: "Invitation accepted successfully",
        type: "success",
      });

      client.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
    onError: (_error, _dto, context) => {
      addNotification({
        message: "Failed to accept invitation",
        type: "error",
      });
      if (context?.previousData) {
        client.setQueryData<InfiniteData<IItemsResponse<TNotification>>>(
          ["notifications"],
          context.previousData,
        );
      }
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

    onSuccess: () => {
      addNotification({
        message: "Invitation rejected successfully",
        type: "success",
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

export const usePatchTransferOwnership = (workspaceId: string) => {
  const client = useQueryClient();
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  return useMutation({
    mutationFn: (participantId: string) =>
      transferOwnership(workspaceId, participantId),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "participants"],
      });
      addNotification({
        message: "Ownership transferred successfully",
        type: "success",
      });
    },
    onError: () => {
      addNotification({
        message: "Failed to transfer ownership",
        type: "error",
      });
    },
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

export const useKickParticipant = (workspaceId: string) => {
  const client = useQueryClient();
  const addNotification = useSystemNotificationStore(
    (state) => state.addNotification,
  );
  return useMutation({
    mutationFn: (participantId: string) =>
      kickParticipant(workspaceId, participantId),
    onMutate: async (participantId: string) => {
      await client.cancelQueries({
        queryKey: ["workspaces", workspaceId, "participants"],
      });
      const oldData = client.getQueryData<IExtendedWorkspaceParticipant[]>([
        "workspaces",
        workspaceId,
        "participants",
      ]);
      client.setQueryData<IExtendedWorkspaceParticipant[]>(
        ["workspaces", workspaceId, "participants"],
        (old) => {
          if (!old) return old;
          return old.filter((p) => p.id !== participantId);
        },
      );
      return { oldData };
    },
    onError: (_error, _dto, context) => {
      if (context?.oldData) {
        client.setQueryData<IExtendedWorkspaceParticipant[]>(
          ["participants", workspaceId],
          context.oldData,
        );
        addNotification({
          type: "error",
          message: "Failed to kick participant",
        });
      }
    },
    onSettled: () => {
      client.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "participants"],
      });
    },
  });
};

export const useGetWorkspaceTodoGroups = (workspaceId: string) => {
  return useQuery({
    queryFn: () => findWorkspaceTodoGroups(workspaceId),
    queryKey: ["workspaces", workspaceId, "todo-groups"],
  });
};

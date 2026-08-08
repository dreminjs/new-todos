import type {
  IExtendedWorkspaceParticipant,
  TActionWorkspaceInvitation,
  TCreateWorkspace,
  TCreateWorkspaceInvitationBody,
  TExtendedWorkspaceInvitation,
  TMembershipResult,
  TTodoGroupResponse,
  TWorkspace,
  TWorkspaceInfo,
  TWorkspaceInvitation,
} from "types";
import { instance } from "../../../shared/api/api.instance";

const BASE_URL = "workspaces";

export const findParticipants = async (
  workspaceId: string,
): Promise<IExtendedWorkspaceParticipant[]> => {
  return (await instance.get(`${BASE_URL}/participant/${workspaceId}`)).data;
};

export const findManyMyWorkspaces = async ({
  take,
}: {
  take?: number;
} = {}): Promise<TWorkspace[]> => {
  return (await instance.get(`${BASE_URL}/my`, { params: { take } })).data;
};

export const createOne = async (dto: TCreateWorkspace): Promise<TWorkspace> => {
  return (await instance.post(`${BASE_URL}`, dto)).data;
};

export const findMembership = async (
  workspaceId: string,
): Promise<TMembershipResult> => {
  return (await instance.get(`${BASE_URL}/${workspaceId}/me`)).data;
};

export const inviteMember = async (
  dto: TCreateWorkspaceInvitationBody & { workspaceId: string },
): Promise<void> => {
  await instance.post(`${BASE_URL}/${dto.workspaceId}/invitation`, dto);
};

export const findManyMyWorkspaceInvitations = async (): Promise<
  TExtendedWorkspaceInvitation[]
> => {
  return (await instance.get(`${BASE_URL}/invitation`)).data;
};

export const acceptInvitation = async (
  dto: Omit<TActionWorkspaceInvitation, "workspaceId">,
): Promise<TWorkspaceInvitation> => {
  return (
    await instance.post(`${BASE_URL}/invitation/${dto.invitationId}/accept`)
  ).data;
};

export const rejectInvitation = async (
  dto: Omit<TActionWorkspaceInvitation, "workspaceId">,
): Promise<void> => {
  await instance.delete(`${BASE_URL}/invitation/${dto.invitationId}/reject`);
};

export const transferOwnership = async (
  workspaceId: string,
  participantId: string,
): Promise<TWorkspace> => {
  return (
    await instance.post(
      `${BASE_URL}/${workspaceId}/participants/${participantId}/transfer-ownership`,
    )
  ).data;
};

// export const acceptRequest = async (
//   dto: TActionWorkspaceRequest,
// ): Promise<TWorkspaceParticipant> => {
//   return await instance.post(`${BASE_URL}/request/${dto.requestId}/accept`);
// };

// export const rejectRequest = async (
//   dto: Omit<TActionWorkspaceInvitation, "workspaceId">,
// ): Promise<void> => {
//   return await instance.post(`${BASE_URL}/request/${dto.invitationId}/reject`);
// };

export const findWorkspaceInfo = async (
  workspaceId: string,
): Promise<TWorkspaceInfo> => {
  return (await instance.get(`${BASE_URL}/${workspaceId}/info`)).data;
};

export const findParticipantsByWorkspaceId = async (
  workspaceId: string,
): Promise<IExtendedWorkspaceParticipant[]> => {
  return (await instance.get(`${BASE_URL}/${workspaceId}/participants`)).data;
};

export const kickParticipant = async (
  workspaceId: string,
  userId: string,
): Promise<void> => {
  await instance.delete(
    `${BASE_URL}/${workspaceId}/participants/${userId}/kick`,
  );
};

export const findWorkspaceTodoGroups = async (
  workspaceId: string,
): Promise<TTodoGroupResponse[]> => {
  return (await instance.get(`${BASE_URL}/${workspaceId}/todo-groups`)).data;
};

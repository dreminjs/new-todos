import type {
  IExtendedWorkspaceParticipant,
  IWorkspaceParticipantResponse,
  TActionWorkspaceInvitation,
  TCreateWorkspace,
  TCreateWorkspaceInvitationBody,
  TExtendedWorkspaceInvitation,
  TMembershipResult,
  TWorkspace,
  TWorkspaceInfo,
  TWorkspaceInvitation,
} from "types";
import { instance } from "../../../shared/api/api.instance";

const BASE_URL = "workspaces";

export const findParticipants = async (
  workspaceId: string,
): Promise<IWorkspaceParticipantResponse[]> => {
  return (await instance.get(`${BASE_URL}/participant/${workspaceId}`)).data;
};

export const findManyMyWorkspaces = async (): Promise<TWorkspace[]> => {
  return (await instance.get(`${BASE_URL}/my`)).data;
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
  return (await instance.get(`${BASE_URL}/${workspaceId}/participants`)).data
};

import type {
  IWorkspaceParticipantResponse,
  TActionWorkspaceInvitation,
  TCreateWorkspace,
  TCreateWorkspaceInvitation,
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
  dto: TCreateWorkspaceInvitation,
): Promise<void> => {
  await instance.post(`${BASE_URL}/invitation`, dto);
};

export const findManyMyWorkspaceInvitations = async (): Promise<
  TExtendedWorkspaceInvitation[]
> => {
  return (await instance.get(`${BASE_URL}/invitation`)).data;
};

export const acceptInvitation = async (
  dto: TActionWorkspaceInvitation,
): Promise<TWorkspaceInvitation> => {
  return (await instance.post(`${BASE_URL}/invitation/accept`, dto)).data;
};

export const rejectInvitation = async (
  dto: TActionWorkspaceInvitation,
): Promise<void> => {
  await instance.post(`${BASE_URL}/invitation/reject`, dto);
};

export const findWorkspaceInfo = async (
  workspaceId: string,
): Promise<TWorkspaceInfo> => {
  return (await instance.get(`${BASE_URL}/${workspaceId}/info`)).data;
};

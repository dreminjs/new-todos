import type { IWorkspaceParticipantResponse, TWorkspace } from "types";
import { instance } from "../../../shared/api/api.instance";

const BASE_URL = "workspace";

export const findParticipants = async (
  workspaceId: string,
): Promise<IWorkspaceParticipantResponse[]> => {
  return (await instance.get(`${BASE_URL}/participant/${workspaceId}`)).data;
};

export const findManyMyWorkspaces = async (): Promise<TWorkspace[]> => {
  return (await instance.get(`${BASE_URL}/my`)).data;
};

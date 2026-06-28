import type { IWorkspaceParticipantResponse } from "types";
import { instance } from "../../../shared/api/api.instance";

const BASE_URL = "workspace";

export const findParticipants = async (
  workspaceId: string,
): Promise<IWorkspaceParticipantResponse[]> => {
  return (await instance.get(`${BASE_URL}/participant/${workspaceId}`)).data;
};

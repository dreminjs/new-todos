import type {
  TChat,
  TCreateChatBodyDto,
  TCreateChatMessageBodyDto,
  TExtendedChatMessage,
  IItemsResponse,
  TCreateChatContext,
} from "types";
import { instance } from "../../../shared/api/api.instance";
import { BASE_WORKSPACES_URL } from "../../workspaces/api/services";
import type { IChatContext } from "../model/chats.types";

const CHATS_URL = "chats";
const MESSAGES_URL = "chat-messages";

export const createOne = async (
  data: TCreateChatBodyDto,
  dtoContext: TCreateChatContext,
): Promise<TChat> => {
  return (
    await instance.post(
      `${BASE_WORKSPACES_URL}/${dtoContext.workspaceId}/${CHATS_URL}`,
      data,
    )
  ).data;
};

export const getChatMessages = async (
  { chatId, workspaceId }: IChatContext,
  cursor?: string,
  take = 20,
): Promise<IItemsResponse<TExtendedChatMessage>> => {
  const params = new URLSearchParams({ take: String(take) });
  if (cursor) params.set("cursor", cursor);
  return (
    await instance.get(
      `${BASE_WORKSPACES_URL}/${workspaceId}/${CHATS_URL}/${chatId}/${MESSAGES_URL}?${params}`,
    )
  ).data;
};

export const createMessage = async (
  data: TCreateChatMessageBodyDto,
  { chatId, workspaceId }: IChatContext,
): Promise<TExtendedChatMessage> => {
  return (
    await instance.post(
      `${BASE_WORKSPACES_URL}/${workspaceId}/${CHATS_URL}/${chatId}/${MESSAGES_URL}`,
      data,
    )
  ).data;
};

export const findWorkspaceChats = async (
  workspaceId: string,
): Promise<TChat[]> => {
  return (await instance.get(`${BASE_WORKSPACES_URL}/${workspaceId}/chats`))
    .data;
};

export const deleteMessageChat = async (
  chatMessageId: string,
  { chatId, workspaceId }: IChatContext,
) => {
  return (await instance.delete(
    `${BASE_WORKSPACES_URL}/${workspaceId}/${CHATS_URL}/${chatId}/${MESSAGES_URL}/${chatMessageId}`,
  )).data;
};

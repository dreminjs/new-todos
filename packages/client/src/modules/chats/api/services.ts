import type {
  TChat,
  TCreateChatBodyDto,
  TCreateChatMessageBodyDto,
  TExtendedChatMessage,
  IItemsResponse,
} from "types";
import { instance } from "../../../shared/api/api.instance";

const CHATS_URL = "chats";
const MESSAGES_URL = "chat-messages";

export const createOne = async (data: TCreateChatBodyDto): Promise<TChat> => {
  return (await instance.post(CHATS_URL, data)).data;
};

export const getChatMessages = async (
  chatId: string,
  cursor?: string,
  take = 20,
): Promise<IItemsResponse<TExtendedChatMessage>> => {
  const params = new URLSearchParams({ take: String(take) });
  if (cursor) params.set("cursor", cursor);
  return (await instance.get(`${MESSAGES_URL}/${chatId}?${params}`)).data;
};

export const createMessage = async (
  data: TCreateChatMessageBodyDto,
): Promise<TExtendedChatMessage> => {
  return (await instance.post(MESSAGES_URL, data)).data;
};

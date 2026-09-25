import { create } from "zustand";

interface IChatStore {
  replyMessageId: string | null;
  onSetReplyId: (id: string | null) => void;
  editMessageId: string | null;
  onSetEditMessageId: (id: string | null) => void;
}

export const useChatStore = create<IChatStore>((set) => ({
  replyMessageId: null,
  onSetReplyId: (id: string | null) => {
    set({ replyMessageId: id });
    set({ editMessageId: null });
  },
  editMessageId: null,
  onSetEditMessageId: (id: string | null) => {
    set({ editMessageId: id });
    set({ replyMessageId: null });
  },
}));

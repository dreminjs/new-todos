import { useState, useCallback } from "react";

export function useChatMessageSelection() {
  const [chatMessageId, setChatMessageId] = useState<string | null>(null);

  const chooseMessageId = useCallback((messageId: string) => {
    setChatMessageId(messageId);
  }, []);

  const closeManagementMenu = useCallback(() => {
    setChatMessageId(null);
  }, []);

  return { chatMessageId, chooseMessageId, closeManagementMenu };
}

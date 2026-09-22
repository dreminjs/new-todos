export const getWorkspaceParticipantKeyByWorkspaceIdAndUserId = (
  workspaceId: string,
  userId: string,
) => {
  return `workspace-participant:${workspaceId}:${userId}`;
};

export const getWorkspaceParticipantKeyByWorkspaceIdAndChatId = (
  workspaceId: string,
  chatId: string,
) => {
  return `workspace-participant:${workspaceId}:${chatId}`;
};

export const getWorkspaceParticipantKeyByIdAndWorkspaceId = (
  participantId: string,
  workspaceId: string,
) => {
  return `workspace-participant:${workspaceId}:${participantId}`;
};

export const getWorkspaceParticipantKeyByUserIdAndChatId = (
  userId: string,
  chatId: string,
) => {
  return `workspace-participant:${userId}:${chatId}`;
};

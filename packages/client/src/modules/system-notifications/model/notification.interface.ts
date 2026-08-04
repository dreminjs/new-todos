import type { TNotification } from "types";

export type TSystemNotification = {
  id: string;
  message: string;
  type: TSystemNotificationType;
  mannualDeleting?: boolean;
  isProcessing?: boolean;
} & Pick<
  TNotification,
  "workspaceId" | "workspaceInvitationId" | "workspaceRequestId"
>;

export type TSystemNotificationType = "success" | "error" | "info" | "warning";
export type TCreateSystemNotificationDto = Omit<TSystemNotification, "id">;

export interface ISystemNotificationStore {
  notifications: TSystemNotification[];
  addNotification: (notification: TCreateSystemNotificationDto) => void;
  removeNotification: (id: string) => void;
}

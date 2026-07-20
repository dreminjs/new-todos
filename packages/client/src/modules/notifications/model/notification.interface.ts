export interface ISystemNotification {
  id: string;
  message: string;
  type: TSystemNotificationType;
}

export type TSystemNotificationType = "success" | "error" | "info" | "warning";
export type TCreateSystemNotificationDto = Omit<ISystemNotification, "id">;

export interface ISystemNotificationStore {
  notifications: ISystemNotification[];
  addNotification: (notification: TCreateSystemNotificationDto) => void;
  removeNotification: (id: string) => void;
}

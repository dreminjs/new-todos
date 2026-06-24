export interface INotification {
  id: string;
  message: string;
  type: TNotificationType;
}

export type TNotificationType = "success" | "error" | "info" | "warning";
export type TCreateNotificationDto = Omit<INotification, "id">;

export interface INotificationStore {
  notifications: INotification[];
  addNotification: (notification: TCreateNotificationDto) => void;
  removeNotification: (id: string) => void;
}

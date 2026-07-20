import { create } from "zustand";
import type { ISystemNotificationStore  } from "./notification.interface";

export const useSystemNotificationStore = create<ISystemNotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = crypto.randomUUID();
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id: id }],
    }));
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

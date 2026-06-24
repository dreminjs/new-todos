import { create } from "zustand";
import type { INotificationStore } from "./notification.interface";

export const useNotificationStore = create<INotificationStore>((set) => ({
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

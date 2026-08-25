import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useNotificationStore = create(
  subscribeWithSelector((set) => ({
    notifications: [],

    addNotification: (notification) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notificationWithId = { ...notification, id };
      set((state) => ({ notifications: [...state.notifications, notificationWithId] }));

      // Auto-remove after 4 seconds
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, 4000);

      return id;
    },

    removeNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    },

    clearNotifications: () => {
      set({ notifications: [] });
    },
  }))
);

export { useNotificationStore };

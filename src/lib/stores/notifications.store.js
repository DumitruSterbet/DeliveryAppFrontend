import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

export const useNotificationsStore = create(
  // persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isConnected: false,
      lastConnectionError: null,

      // Add new notification
      addNotification: (notification) => set((state) => {
        const newNotification = {
          ...notification,
          id: notification.id || Date.now().toString(),
          timestamp: notification.timestamp || new Date().toISOString(),
          isRead: notification.isRead || false,
        };
        
        // Add to the beginning of the array (most recent first)
        const updatedNotifications = [newNotification, ...state.notifications];
        
        // Keep only the last 100 notifications
        const trimmedNotifications = updatedNotifications.slice(0, 100);
        
        // Update unread count
        const unreadCount = trimmedNotifications.filter(n => !n.isRead).length;
        
        return {
          notifications: trimmedNotifications,
          unreadCount,
        };
      }),

      // Mark notification as read
      markAsRead: (notificationId) => set((state) => {
        const updatedNotifications = state.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
        
        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
        
        return {
          notifications: updatedNotifications,
          unreadCount,
        };
      }),

      // Mark all notifications as read
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true,
        })),
        unreadCount: 0,
      })),

      // Set unread count (from server)
      setUnreadCount: (count) => set(() => ({
        unreadCount: count,
      })),

      // Clear all notifications
      clearNotifications: () => set(() => ({
        notifications: [],
        unreadCount: 0,
      })),

      // Remove specific notification
      removeNotification: (notificationId) => set((state) => {
        const updatedNotifications = state.notifications.filter(
          notification => notification.id !== notificationId
        );
        
        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
        
        return {
          notifications: updatedNotifications,
          unreadCount,
        };
      }),

      // Connection status
      setConnectionStatus: (isConnected, error = null) => set(() => ({
        isConnected,
        lastConnectionError: error,
      })),

      // Get notifications by type or all
      getNotificationsByType: (type) => {
        const { notifications } = get();
        return type
          ? notifications.filter(notification => notification.type === type)
          : notifications;
      },

      // Get unread notifications
      getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter(notification => !notification.isRead);
      },
    })
    // {
    //   name: 'notifications-store',
    //   partialize: (state) => ({
    //     notifications: state.notifications,
    //     unreadCount: state.unreadCount,
    //   }),
    // }
  // )
);
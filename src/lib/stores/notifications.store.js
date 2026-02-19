import { create } from 'zustand';
import { apiFetchNotifications } from '../actions/notification.action';
// import { persist } from 'zustand/middleware';

export const useNotificationsStore = create(
  // persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isConnected: false,
      lastConnectionError: null,
      isLoading: false,
      lastFetch: null,

      // Fetch notifications from API
      fetchNotifications: async (onlyUnread = false) => {
        set({ isLoading: true });
        try {
          const notifications = await apiFetchNotifications(onlyUnread);
          const unreadCount = notifications.filter(n => !n.isRead).length;
          
          set({ 
            notifications, 
            unreadCount,
            isLoading: false,
            lastFetch: new Date().toISOString()
          });
          
          return notifications;
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Load notifications initially (call this when app loads)
      loadNotifications: async () => {
        const { lastFetch } = get();
        // Only fetch if we haven't fetched recently (within last 5 minutes)
        const shouldFetch = !lastFetch || 
          new Date() - new Date(lastFetch) > 5 * 60 * 1000;
          
        if (shouldFetch) {
          try {
            await get().fetchNotifications();
          } catch (error) {
            // Silently fail initial load, SignalR will provide real-time updates
            console.log('Initial notification load failed, relying on SignalR');
          }
        }
      },

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
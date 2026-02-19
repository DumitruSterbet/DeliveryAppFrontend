import { useMutation, useQuery } from '@tanstack/react-query';
import { useNotificationsStore } from '@/lib/stores/notifications.store';
import { 
  apiFetchNotifications, 
  apiFetchUnreadCount,
  apiMarkNotificationAsRead, 
  apiMarkAllNotificationsAsRead
} from '@/lib/actions/notification.action';

export const useNotifications = () => {
  const { 
    notifications, 
    unreadCount, 
    isLoading,
    fetchNotifications: storeFetch,
    markAsRead: storeMarkAsRead,
    markAllAsRead: storeMarkAllAsRead,
    setUnreadCount
  } = useNotificationsStore();

  // Fetch notifications query
  const { 
    refetch: refetchNotifications,
    isRefetching
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => storeFetch(),
    enabled: false, // Don't auto-fetch, we'll manually trigger
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch unread count query
  const {
    refetch: refetchUnreadCount,
    isRefetching: isRefetchingCount
  } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      const count = await apiFetchUnreadCount();
      setUnreadCount(count);
      return count;
    },
    enabled: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Mark notification as read mutation  
  const markAsReadMutation = useMutation({
    mutationFn: apiMarkNotificationAsRead,
    onSuccess: (_, notificationId) => {
      storeMarkAsRead(notificationId);
    },
    onError: (error) => {
      console.error('Failed to mark notification as read:', error);
    }
  });

  // Mark all notifications as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: apiMarkAllNotificationsAsRead,
    onSuccess: () => {
      storeMarkAllAsRead();
    },
    onError: (error) => {
      console.error('Failed to mark all notifications as read:', error);
    }
  });

  return {
    // Data
    notifications,
    unreadCount,
    isLoading: isLoading || isRefetching,

    // Actions  
    fetchNotifications: refetchNotifications,
    fetchUnreadCount: refetchUnreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,

    // Mutation states
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isRefreshingCount: isRefetchingCount,
  };
};
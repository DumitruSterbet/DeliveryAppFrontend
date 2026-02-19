import { useEffect, useCallback, useRef } from 'react';
import { useCurrentUser } from '@/lib/store';
import { useNotificationsStore } from '@/lib/stores/notifications.store';
import { signalRService } from '@/lib/signalr.service';
import useNotification from './useNotification';

export const useSignalR = () => {
  // Check if SignalR is enabled via environment variable
  const isSignalREnabled = import.meta.env.VITE_ENABLE_SIGNALR === 'true';
  
  const { currentUser } = useCurrentUser();
  const { user, userId } = currentUser || {};
  
  // Only log occasionally to avoid spam
  const logRef = useRef(0);
  if (logRef.current % 10 === 0) {
    console.log('useSignalR - enabled:', isSignalREnabled);
    console.log('useSignalR - currentUser:', currentUser);
    console.log('useSignalR - userId:', userId);
    console.log('useSignalR - user exists:', !!user);
  }
  logRef.current++;
  
  const {
    addNotification,
    setUnreadCount,
    setConnectionStatus,
    isConnected,
    lastConnectionError,
    loadNotifications
  } = useNotificationsStore();
  const [notify] = useNotification();
  const connectionAttempted = useRef(false);

  // Get JWT token from localStorage
  const getAuthToken = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      console.log('Getting auth token from localStorage:', token ? 'Token found' : 'No token');
      return token;
    } catch (error) {
      console.warn('Failed to get auth token:', error);
      return null;
    }
  }, []);

  // Handle receiving new notifications
  const handleReceiveNotification = useCallback((notificationDto) => {
    try {
      console.log('Received notification:', notificationDto);
      
      // Add to store
      addNotification(notificationDto);

      // Show toast notification
      notify({
        title: notificationDto.title || 'New Notification',
        description: notificationDto.message || notificationDto.content,
        variant: 'success'
      });
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  }, [addNotification, notify]);

  // Handle notification count updates
  const handleNotificationCountUpdated = useCallback((count) => {
    try {
      console.log('Notification count updated:', count);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error updating notification count:', error);
    }
  }, [setUnreadCount]);

  // Connect to SignalR
  const connect = useCallback(async () => {
    if (!userId || !user || connectionAttempted.current) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.log('No auth token available for SignalR connection');
      return;
    }

    try {
      connectionAttempted.current = true;
      setConnectionStatus(false, null);

      console.log('Connecting to SignalR...');
      await signalRService.connect(token);
      
      // Set up event listeners
      signalRService.onReceiveNotification(handleReceiveNotification);
      signalRService.onNotificationCountUpdated(handleNotificationCountUpdated);

      setConnectionStatus(true, null);
      console.log('SignalR connected successfully');

      // Load initial notifications from API
      try {
        await loadNotifications();
        console.log('Initial notifications loaded successfully');
      } catch (error) {
        console.log('Failed to load initial notifications, will rely on real-time updates');
      }

    } catch (error) {
      console.error('SignalR connection failed:', error);
      setConnectionStatus(false, error.message || 'Connection failed');
      connectionAttempted.current = false;

      // Retry connection after a delay
      setTimeout(() => {
        connectionAttempted.current = false;
        connect();
      }, 5000);
    }
  }, [
    userId,
    user,
    getAuthToken,
    handleReceiveNotification,
    handleNotificationCountUpdated,
    setConnectionStatus
  ]);

  // Disconnect from SignalR
  const disconnect = useCallback(async () => {
    if (!isConnected && !signalRService.connectionPromise) {
      console.log('SignalR already disconnected');
      return;
    }
    
    try {
      console.log('SignalR - Disconnecting...');
      // Remove event listeners
      signalRService.offReceiveNotification(handleReceiveNotification);
      signalRService.offNotificationCountUpdated(handleNotificationCountUpdated);
      
      await signalRService.disconnect();
      setConnectionStatus(false, null);
      connectionAttempted.current = false;
      console.log('SignalR disconnected');
    } catch (error) {
      console.error('Error disconnecting SignalR:', error);
    }
  }, [isConnected, handleReceiveNotification, handleNotificationCountUpdated, setConnectionStatus]);

  // Effect to handle connection based on user authentication
  useEffect(() => {
    if (!isSignalREnabled) {
      console.log('SignalR disabled via environment variable');
      return;
    }

    // Check if we have all required data for connection
    const token = getAuthToken();
    const hasRequiredData = user && userId && token;

    console.log('SignalR Connection Check:', {
      hasUser: !!user,
      hasUserId: !!userId,
      hasToken: !!token,
      isConnected,
      connectionAttempted: connectionAttempted.current
    });

    if (hasRequiredData && !isConnected && !connectionAttempted.current) {
      console.log('SignalR - User authenticated with valid token, attempting to connect');
      const timer = setTimeout(() => {
        connect();
      }, 500); // Increased delay to ensure everything is ready
      
      return () => {
        clearTimeout(timer);
      };
    } else if (currentUser?.isLoaded && (!userId || !token)) {
      // User is loaded but not properly authenticated - disconnect
      console.log('SignalR - User not properly authenticated, disconnecting');
      disconnect();
      connectionAttempted.current = false; // Reset so we can try again when auth is ready
    }
  }, [isSignalREnabled, user, userId, currentUser?.isLoaded, isConnected, connect, disconnect, getAuthToken]);

  return {
    isConnected,
    lastConnectionError,
    connect,
    disconnect,
    signalRService
  };
};

export default useSignalR;
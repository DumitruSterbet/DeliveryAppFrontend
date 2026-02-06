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
    lastConnectionError
  } = useNotificationsStore();
  const [notify] = useNotification();
  const connectionAttempted = useRef(false);

  // Get JWT token from localStorage
  const getAuthToken = useCallback(() => {
    try {
      return localStorage.getItem('token');
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

    // Only connect if we have both user and userId
    if (user && userId) {
      console.log('SignalR - User authenticated, attempting to connect');
      // Add a small delay to ensure all other hooks are initialized
      const timer = setTimeout(() => {
        connect();
      }, 100);
      
      return () => {
        clearTimeout(timer);
      };
    } else if (currentUser?.isLoaded && !userId) {
      // User is loaded but not authenticated - disconnect
      console.log('SignalR - User not authenticated, disconnecting');
      disconnect();
    }
    // Don't disconnect if currentUser is still loading
  }, [isSignalREnabled, user, userId, currentUser?.isLoaded, connect, disconnect]);

  // Effect to handle token changes
  useEffect(() => {
    if (!isSignalREnabled) {
      return;
    }

    const token = getAuthToken();
    if (token && userId && !isConnected && !connectionAttempted.current) {
      connect();
    } else if (!token && isConnected) {
      disconnect();
    }
  }, [isSignalREnabled, getAuthToken, userId, isConnected, connect, disconnect]);

  return {
    isConnected,
    lastConnectionError,
    connect,
    disconnect,
    signalRService
  };
};

export default useSignalR;
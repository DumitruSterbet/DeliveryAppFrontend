// SignalR Configuration
export const SIGNALR_CONFIG = {
  // Update this URL to match your actual SignalR hub endpoint
  // Can be overridden by VITE_SIGNALR_HUB_URL environment variable
  // Use HTTP/HTTPS for negotiation - SignalR will automatically upgrade to WebSocket
  HUB_URL: import.meta.env.VITE_SIGNALR_HUB_URL || 'https://localhost:7227/hubs/notifications',
  
  // Connection options
  CONNECTION_OPTIONS: {
    withCredentials: true, // Backend supports CORS with credentials
    transport: 'WebSockets', // or 'ServerSentEvents', 'LongPolling'
  },
  
  // Retry policy for automatic reconnection
  RETRY_POLICY: {
    nextRetryDelayInMilliseconds: (retryContext) => {
      if (retryContext.previousRetryCount === 0) {
        return 0;
      }
      return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
    }
  },
  
  // Event names (should match your backend)
  EVENTS: {
    RECEIVE_NOTIFICATION: 'ReceiveNotification',
    NOTIFICATION_COUNT_UPDATED: 'NotificationCountUpdated',
  },
  
  // Logging level
  LOG_LEVEL: import.meta.env.VITE_SIGNALR_DEBUG === 'true' ? 'Debug' : 'Information', // 'Trace', 'Debug', 'Information', 'Warning', 'Error', 'Critical', 'None'
};
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { SIGNALR_CONFIG } from '@/configs/signalr.config';

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.connectionPromise = null;
  }

  async connect(token) {
    console.log('SignalRService - connect called with token:', token);
    if (this.connection && this.isConnected) {
      return this.connection;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.createConnection(token);
    return this.connectionPromise;
  }

  async createConnection(token) {
    try {
      console.log('Creating SignalR connection to:', SIGNALR_CONFIG.HUB_URL);
      console.log('Using token:', token ? 'Token present' : 'No token');
      
      // Create the connection with authentication
      this.connection = new HubConnectionBuilder()
        .withUrl(SIGNALR_CONFIG.HUB_URL, {
          accessTokenFactory: () => token,
          withCredentials: SIGNALR_CONFIG.CONNECTION_OPTIONS.withCredentials,
          // Skip negotiation if in development and having SSL issues
          skipNegotiation: false,
          transport: import.meta.env.DEV ? undefined : 'WebSockets'
        })
        .withAutomaticReconnect(SIGNALR_CONFIG.RETRY_POLICY)
        .configureLogging(LogLevel[SIGNALR_CONFIG.LOG_LEVEL])
        .build();

      // Set up connection event handlers
      this.connection.onreconnecting((error) => {
        console.log('SignalR connection lost due to error:', error);
        this.isConnected = false;
      });

      this.connection.onreconnected(() => {
        console.log('SignalR reconnected successfully');
        this.isConnected = true;
      });

      this.connection.onclose((error) => {
        console.log('SignalR connection closed:', error);
        this.isConnected = false;
        this.connectionPromise = null;
      });

      // Start the connection
      console.log('Starting SignalR connection...');
      await this.connection.start();
      this.isConnected = true;
      console.log('SignalR connected successfully to:', SIGNALR_CONFIG.HUB_URL);

      return this.connection;
    } catch (error) {
      console.error('Failed to connect to SignalR hub:', error);
      console.error('Connection URL was:', SIGNALR_CONFIG.HUB_URL);
      
      // In development, provide helpful error messages
      if (import.meta.env.DEV) {
        if (error.message?.includes('Failed to fetch') || error.message?.includes('negotiate')) {
          console.warn('💡 SignalR Connection Troubleshooting:');
          console.warn('1. Is your backend server running on the correct port?');
          console.warn('2. Current URL:', SIGNALR_CONFIG.HUB_URL);
          console.warn('3. Try these solutions:');
          console.warn('   - Check if backend is running: curl ' + SIGNALR_CONFIG.HUB_URL.replace('/hubs/notifications', '/health'));
          console.warn('   - Try HTTP instead of HTTPS: change URL to http://localhost:7227/hubs/notifications');
          console.warn('   - Check CORS settings in your backend');
          console.warn('   - Verify the port number matches your backend');
          console.warn('4. Network tab in browser DevTools will show the exact error');
        }
      }
      
      this.connectionPromise = null;
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.isConnected = false;
      this.connectionPromise = null;
      console.log('SignalR disconnected');
    }
  }

  onReceiveNotification(callback) {
    if (this.connection) {
      this.connection.on(SIGNALR_CONFIG.EVENTS.RECEIVE_NOTIFICATION, callback);
    }
  }

  onNotificationCountUpdated(callback) {
    if (this.connection) {
      this.connection.on(SIGNALR_CONFIG.EVENTS.NOTIFICATION_COUNT_UPDATED, callback);
    }
  }

  offReceiveNotification(callback) {
    if (this.connection) {
      this.connection.off(SIGNALR_CONFIG.EVENTS.RECEIVE_NOTIFICATION, callback);
    }
  }

  offNotificationCountUpdated(callback) {
    if (this.connection) {
      this.connection.off(SIGNALR_CONFIG.EVENTS.NOTIFICATION_COUNT_UPDATED, callback);
    }
  }

  getConnection() {
    return this.connection;
  }

  isConnectionActive() {
    return this.isConnected && this.connection;
  }
}

// Export singleton instance
export const signalRService = new SignalRService();
export default signalRService;
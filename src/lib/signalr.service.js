import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { SIGNALR_CONFIG } from '@/configs/signalr.config';

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.connectionPromise = null;
  }

  async connect(token) {
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
      // Create the connection with authentication
      this.connection = new HubConnectionBuilder()
        .withUrl(SIGNALR_CONFIG.HUB_URL, {
          accessTokenFactory: () => token,
          withCredentials: SIGNALR_CONFIG.CONNECTION_OPTIONS.withCredentials
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
      await this.connection.start();
      this.isConnected = true;
      console.log('SignalR connected successfully');

      return this.connection;
    } catch (error) {
      console.error('Failed to connect to SignalR hub:', error);
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
# SignalR Real-time Notifications Integration

This project now includes real-time notifications using SignalR. Here's how it works:

## Backend Requirements

Your SignalR backend should be configured with:
- **Endpoint**: `wss://your-api/hubs/notifications`
- **Authentication**: JWT Bearer Token required
- **Auto Group Management**: Users automatically added to `user:{userId}` group

### Server → Client Events

| Event Name | Payload Type | Description |
|------------|-------------|-------------|
| `ReceiveNotification` | `NotificationDto` | Sends full notification object when new notification is created |
| `NotificationCountUpdated` | `number (int)` | Sends updated unread count when notification read status changes |

## Frontend Implementation

### Files Created/Modified

1. **SignalR Service** (`src/lib/signalr.service.js`)
   - Handles connection to SignalR hub
   - Manages authentication with JWT token
   - Provides automatic reconnection

2. **Notifications Store** (`src/lib/stores/notifications.store.js`)
   - Zustand store for managing notifications state
   - Persists notifications and unread count
   - Provides actions for managing notifications

3. **SignalR Hook** (`src/hooks/useSignalR.jsx`)
   - React hook that manages SignalR connection lifecycle
   - Automatically connects/disconnects based on user authentication
   - Handles real-time events and updates the store

4. **Configuration** (`src/configs/signalr.config.js`)
   - Centralized configuration for SignalR settings
   - Supports environment variables

### Usage

The SignalR integration is automatically initialized in the `App.jsx` component:

```jsx
import { useSignalR } from "./hooks";

function App() {
  // ... other code
  useSignalR(); // Initializes SignalR connection
  return (
    // ... app content
  );
}
```

### Configuration

1. **Environment Variables** (`.env.local`):
```env
VITE_SIGNALR_HUB_URL=wss://localhost:7227/hubs/notifications
VITE_SIGNALR_DEBUG=true
```

2. **Update SignalR Endpoint**: 
   - Edit `src/configs/signalr.config.js`
   - Or set `VITE_SIGNALR_HUB_URL` environment variable

### Components Updated

1. **Navbar Notification Button**
   - Shows real-time unread count
   - Displays recent notifications in dropdown
   - Marks notifications as read when clicked

2. **Notifications Page**
   - Shows all notifications with real-time updates
   - Connection status indicator
   - Mark all as read functionality
   - Remove individual notifications

3. **Sidebar**
   - Badge count shows real-time unread notifications

### Notification Data Structure

Expected notification object from backend:
```javascript
{
  id: "string",
  title: "string",
  message: "string", // or content
  timestamp: "ISO date string",
  isRead: boolean,
  type: "string", // optional
  userImage: "string", // optional
  link: "string" // optional navigation link
}
```

### Store API

```javascript
import { useNotificationsStore } from '@/lib/stores/notifications.store';

const {
  notifications,       // Array of all notifications
  unreadCount,        // Number of unread notifications
  isConnected,        // SignalR connection status
  addNotification,    // Add new notification
  markAsRead,         // Mark notification as read
  markAllAsRead,      // Mark all notifications as read
  removeNotification, // Remove specific notification
  clearNotifications  // Clear all notifications
} = useNotificationsStore();
```

### Connection Management

The SignalR connection is automatically managed:
- **Connects** when user is authenticated
- **Disconnects** when user logs out
- **Reconnects** automatically on connection loss
- **Retries** with exponential backoff

### Authentication

The system uses the JWT token stored in `localStorage.getItem('token')` for authentication with the SignalR hub.

### Troubleshooting

1. **Connection Issues**:
   - Check if the SignalR endpoint URL is correct
   - Verify JWT token is valid
   - Check browser console for connection errors

2. **Not Receiving Notifications**:
   - Verify user is authenticated
   - Check if user is in the correct group (`user:{userId}`)
   - Ensure backend is sending to the correct user group

3. **CORS Issues**:
   - Configure CORS on your SignalR backend
   - Ensure WebSocket connections are allowed

### Development

To test the integration:

1. **Start your backend** with SignalR hub
2. **Update the endpoint** in config or environment variables
3. **Run the frontend**: `npm run dev`
4. **Login** to establish connection
5. **Send test notifications** from your backend

The browser console will show connection status and received events when debug logging is enabled.
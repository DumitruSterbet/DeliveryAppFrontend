import { Link, Navigate } from "react-router-dom";

import { useCurrentUser } from "@/lib/store";
import { useNotificationsStore } from "@/lib/stores/notifications.store";
import { PatternBg } from "@/components";

const Notification = () => {
  const { currentUser } = useCurrentUser();
  const { user, isLoaded } = currentUser || {};
  const store = useNotificationsStore();
  const { 
    notifications = [], 
    unreadCount = 0, 
    markAllAsRead = () => {}, 
    markAsRead = () => {}, 
    removeNotification = () => {},
    isConnected = false 
  } = store || {};

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const handleRemoveNotification = (e, notificationId) => {
    e.preventDefault();
    e.stopPropagation();
    removeNotification(notificationId);
  };

  const formatNotificationTime = (timestamp) => {
    try {
      if (!timestamp) return 'Recently';
      const now = new Date();
      const notificationTime = new Date(timestamp);
      const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <>
      {isLoaded && (
        <>
          {!user ? (
            <Navigate to="/" replace={true} />
          ) : (
            <div className="relative w-auto p-4 overflow-hidden rounded bg-card xs:p-6">
              <PatternBg />
              <div className="relative z-50 flex justify-between pb-4 border-b border-divider">
                <h5 className="flex items-center justify-between text-xl font-bold">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="w-5 h-5 ml-2 text-sm text-white rounded-full bg-primary flex_justify_center">
                      {unreadCount}
                    </span>
                  )}
                </h5>

                <div className="flex items-center gap-4">
                  <div className={`text-xs px-2 py-1 rounded ${isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      className="text-sm font-bold hover:text-primary"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              </div>

              {notifications.length > 0 ? (
                <ul className="flex flex-col gap-4 list-none">
                  {notifications.map((notification) => (
                    <li 
                      key={notification.id}
                      className={`flex justify-between gap-3 p-3 rounded cursor-pointer hover:bg-main transition-colors ${
                        !notification.isRead ? 'bg-primary-opacity border-l-4 border-primary' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3 flex-1">
                        {notification.userImage ? (
                          <img
                            src={notification.userImage}
                            alt="notification user avatar"
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-lg font-bold">
                              {notification.title?.charAt(0) || 'N'}
                            </span>
                          </div>
                        )}
                        <div className="flex-auto text-sm">
                          <div className="flex flex-wrap items-center">
                            <span className="font-bold">{notification.title || 'Notification'}</span>
                            {!notification.isRead && (
                              <div className="relative w-3 h-3 ml-3 flex_justify_center">
                                <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
                                <div className="absolute inline-block w-full h-full bg-red-500 rounded-full animate-ping" />
                              </div>
                            )}
                          </div>
                          <p className="mt-1 text-secondary">{notification.message || notification.content}</p>
                          <p className="mt-1 text-gb">{formatNotificationTime(notification.timestamp)}</p>
                          {notification.link && (
                            <Link 
                              to={notification.link} 
                              className="mt-2 text-primary hover:underline text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View details →
                            </Link>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleRemoveNotification(e, notification.id)}
                        className="text-secondary hover:text-red-500 p-1"
                        title="Remove notification"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                  <p className="text-secondary">When you receive notifications, they'll appear here.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Notification;

import axios from "axios";

const API_BASE = "http://localhost:5034/api";

/**
 * Fetch user notifications from API
 * @param {boolean} onlyUnread - Whether to fetch only unread notifications
 * @returns {Promise<Array>} Array of notification objects
 */
export const apiFetchNotifications = async (onlyUnread = false) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/notifications?onlyUnread=${onlyUnread}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
};

/**
 * Get unread notifications count
 * @returns {Promise<number>} Unread count
 */
export const apiFetchUnreadCount = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/notifications/unread-count`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    return response.data || 0;
  } catch (error) {
    console.error('Failed to fetch unread count:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - The ID of the notification to mark as read
 */
export const apiMarkNotificationAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE}/notifications/${notificationId}/read`, {}, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const apiMarkAllNotificationsAsRead = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE}/notifications/read-all`, {}, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw error;
  }
};
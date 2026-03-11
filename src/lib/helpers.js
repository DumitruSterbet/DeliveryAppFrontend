import axios from "axios";
import imageCompression from "browser-image-compression";
const API_BASE = "http://localhost:5034/api";
import {
  collection as firebaseCollection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  addDoc,
  getCountFromServer,
  orderBy,
  deleteDoc,
  onSnapshot,
} from "@firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "@firebase/storage";

//import { db, storage } from "@/configs";

const DEEZER_API_URL = import.meta.env.VITE_PUBLIC_DEEZER_API_URL;
const CORS_URL = import.meta.env.VITE_PUBLIC_CORS_URL;

// ==================== CATEGORY API HELPERS ====================

/**
 * apiFetchCategories - GET /api/categories
 * Fetches music categories from the backend (replaces Deezer genres)
 */
export const apiFetchCategories = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/categories`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

// ==================== END CATEGORY API HELPERS ====================

// ==================== AUTH API HELPERS ====================

/**
 * apiRegister - POST /api/auth/register
 * Creates a new user account
 */
export const apiRegister = async ({ email, password, username, role }) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      email,
      password,
      username,
      role
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiLogin - POST /api/auth/login
 * Authenticates user and returns token
 */
export const apiLogin = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiLogout - POST /api/auth/logout
 * Logs out the user
 */
export const apiLogout = async () => {
  try {
    const response = await axios.post(`${API_BASE}/auth/logout`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== END AUTH API HELPERS ====================

// ==================== PLAYLIST API HELPERS ====================

/**
 * apiSaveRecentPlayed - POST /api/playlists/recent
 * Save a playlist to recent played
 */
export const apiSaveRecentPlayed = async (playlistId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE}/playlists/recent`,
      { playlistId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiFetchRecentPlayed - GET /api/playlists/recent
 * Fetch user's recently played playlists
 */
export const apiFetchRecentPlayed = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/playlists/recent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiFetchMyPlaylists - GET /api/playlists/my
 * Fetch all user's custom playlists
 */
export const apiFetchMyPlaylists = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/playlists/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiCreatePlaylist - POST /api/playlists
 * Create a new playlist
 */
export const apiCreatePlaylist = async ({ name, description, imageUrl }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE}/playlists`,
      { name, description, imageUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiGetPlaylist - GET /api/playlists/:id
 * Get a single playlist by ID
 */
export const apiGetPlaylist = async (playlistId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiUpdatePlaylist - PUT /api/playlists/:id
 * Update a playlist
 */
export const apiUpdatePlaylist = async (playlistId, { name, description, imageUrl }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE}/playlists/${playlistId}`,
      { name, description, imageUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiDeletePlaylist - DELETE /api/playlists/:id
 * Delete a playlist
 */
export const apiDeletePlaylist = async (playlistId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_BASE}/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiAddTrackToPlaylist - POST /api/playlists/:id/tracks
 * Add a track to a playlist
 */
export const apiAddTrackToPlaylist = async (playlistId, trackId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE}/playlists/${playlistId}/tracks`,
      { trackId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiRemoveTrackFromPlaylist - DELETE /api/playlists/:id/tracks/:trackId
 * Remove a track from a playlist
 */
export const apiRemoveTrackFromPlaylist = async (playlistId, trackId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE}/playlists/${playlistId}/tracks/${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiFavoritePlaylists - GET /api/playlists/favorites
 * Get user's favorite playlists
 */
export const apiFavoritePlaylists = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/playlists/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiAddFavoritePlaylist - POST /api/playlists/:id/favorite
 * Add a playlist to favorites
 */
export const apiAddFavoritePlaylist = async (playlistId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE}/playlists/${playlistId}/favorite`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiRemoveFavoritePlaylist - DELETE /api/playlists/:id/favorite
 * Remove a playlist from favorites
 */
export const apiRemoveFavoritePlaylist = async (playlistId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE}/playlists/${playlistId}/favorite`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

// ==================== END PLAYLIST API HELPERS ====================

// ==================== PROFILE API HELPERS ====================

/**
 * apiGetProfile - GET /api/profile
 * Get current user's profile
 */
export const apiGetProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiUpdateProfile - PUT /api/profile
 * Update user profile
 */
export const apiUpdateProfile = async ({ username, imageUrl, prefs, player }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE}/profile`,
      { username, imageUrl, prefs, player },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

/**
 * apiChangePassword - POST /api/profile/change-password
 * Change user password
 */
export const apiChangePassword = async ({ currentPassword, newPassword }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE}/profile/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.Data;
  } catch (error) {
    throw error;
  }
};

// ==================== END PROFILE API HELPERS ====================

// ==================== UPLOAD API HELPERS ====================

/**
 * uploadImage - POST /api/upload/image
 * Upload and compress an image to the backend
 */
export const uploadImage = async ({ imageFile, storagePath, fileName }) => {
  try {
    const compressImgOption = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(imageFile, compressImgOption);
    
    const token = localStorage.getItem("token");
    const formData = new FormData();
    
    // Prioritize original filename, fallback to provided fileName, then 'image.jpg'
    const finalFileName = imageFile.name || fileName || 'image.jpg';
    
    formData.append("image", compressedFile, finalFileName);
    formData.append("folder", storagePath || "uploads");

    const response = await axios.post(`${API_BASE}/upload/image`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });


    // Handle standardized response structure
    if (response.data.Data && response.data.Data.url) {
      return response.data.Data.url;
    }
    
    // Fallback: if Data is the URL string directly
    if (typeof response.data.Data === 'string') {
      return response.data.Data;
    }
    
    // Fallback: if response.data is the URL directly
    if (typeof response.data === 'string') {
      return response.data;
    }

    throw new Error("Invalid response format from upload endpoint");
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

// ==================== END UPLOAD API HELPERS ====================

export const fbAddDoc = async ({ data, collection }) => {
  const response = await axios.post(`${API_BASE}/${collection}`, data);
  return response.data.Data;
};

/**
 * fbSetDoc → used for register
 * Example:
 * fbSetDoc({ collection: "auth/register", data })
 */
export const fbSetDoc = async ({ data, collection }) => {
  const response = await axios.post(`${API_BASE}/${collection}`, data);
  return response.data.Data;
};

/**
 * fbGetDoc → GET /api/{collection}/{id}
 */
export const fbGetDoc = async ({ collection, id }) => {
  const response = await axios.get(`${API_BASE}/${collection}/${id}`);
  return response.data.Data;
};

/**
 * fbUpdateDoc → PUT /api/{collection}/{id}
 */
export const fbUpdateDoc = async ({ data, collection, id }) => {
  const response = await axios.put(`${API_BASE}/${collection}/${id}`, data);
  return response.data.Data;
};

/**
 * fbDeleteDoc → DELETE /api/{collection}/{id}
 */
export const fbDeleteDoc = async ({ collection, id }) => {
  const response = await axios.delete(`${API_BASE}/${collection}/${id}`);
  return response.data.Data;
};
export const fbGetCollection = async ({
  collection,
  whereQueries = [],
  orderByQueries = [],
}) => {
  const whereQ = whereQueries.map((item) => {
    const [key, sign, value] = item;
    return where(key, sign, value);
  });
  const orderByQ = orderByQueries.map((item) => {
    const [key, value] = item;
    return orderBy(key, value);
  });

  const q = query(firebaseCollection(db, collection), ...whereQ, ...orderByQ);
  return await getDocs(q);
};

export const fbSnapshotDoc = ({ collection, id, callback }) => {
  if (id) {
    return onSnapshot(doc(db, collection, id), (doc) => {
      callback(doc);
    });
  }
};

export const fbDeleteStorage = async (storagePath) => {
  await deleteObject(ref(storage, storagePath));
};

export const fbCountCollection = async ({ collection, whereQueries }) => {
  const whereQ = whereQueries.map((item) => {
    const [key, sign, value] = item;
    return where(key, sign, value);
  });

  const q = query(firebaseCollection(db, collection), ...whereQ);
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

const getBaseUrl = (endpoint) => {
  // Check if endpoint is for products (POST/GET) - route to local API
  const productsMatch = endpoint.match(/^api\/products$/);
  if (productsMatch) {
    return `${API_BASE}/products`;
  }

  // Check if endpoint is for categories (POST/GET) - route to local API
  const categoriesMatch = endpoint.match(/^api\/categories$/);
  if (categoriesMatch) {
    return `${API_BASE}/categories`;
  }

  // Check if endpoint is for admin users list/create - route to local API
  const adminUsersMatch = endpoint.match(/^api\/admin\/users$/);
  if (adminUsersMatch) {
    return `${API_BASE}/admin/users`;
  }

  // Check if endpoint is for admin user details/delete - route to local API
  const adminUserByIdMatch = endpoint.match(/^api\/admin\/users\/([^/]+)$/);
  if (adminUserByIdMatch) {
    const userId = adminUserByIdMatch[1];
    return `${API_BASE}/admin/users/${userId}`;
  }

  // Check if endpoint is for admin user role update - route to local API
  const adminUserRoleMatch = endpoint.match(/^api\/admin\/users\/([^/]+)\/role$/);
  if (adminUserRoleMatch) {
    const userId = adminUserRoleMatch[1];
    return `${API_BASE}/admin/users/${userId}/role`;
  }

  // Check if endpoint is for admin user lock toggle - route to local API
  const adminUserToggleLockMatch = endpoint.match(/^api\/admin\/users\/([^/]+)\/toggle-lock$/);
  if (adminUserToggleLockMatch) {
    const userId = adminUserToggleLockMatch[1];
    return `${API_BASE}/admin/users/${userId}/toggle-lock`;
  }

  // Check if endpoint is for admin finance summary - route to local API
  const adminFinanceSummaryMatch = endpoint.match(/^api\/admin\/finance\/summary$/);
  if (adminFinanceSummaryMatch) {
    return `${API_BASE}/admin/finance/summary`;
  }

  // Check if endpoint is for admin finance payouts list - route to local API
  const adminFinancePayoutsMatch = endpoint.match(/^api\/admin\/finance\/payouts$/);
  if (adminFinancePayoutsMatch) {
    return `${API_BASE}/admin/finance/payouts`;
  }

  // Check if endpoint is for admin payout approve - route to local API
  const adminFinancePayoutApproveMatch = endpoint.match(/^api\/admin\/finance\/payouts\/([^/]+)\/approve$/);
  if (adminFinancePayoutApproveMatch) {
    const payoutId = adminFinancePayoutApproveMatch[1];
    return `${API_BASE}/admin/finance/payouts/${payoutId}/approve`;
  }

  // Check if endpoint is for admin payout reject - route to local API
  const adminFinancePayoutRejectMatch = endpoint.match(/^api\/admin\/finance\/payouts\/([^/]+)\/reject$/);
  if (adminFinancePayoutRejectMatch) {
    const payoutId = adminFinancePayoutRejectMatch[1];
    return `${API_BASE}/admin/finance/payouts/${payoutId}/reject`;
  }

  // Check if endpoint is for admin payout retry - route to local API
  const adminFinancePayoutRetryMatch = endpoint.match(/^api\/admin\/finance\/payouts\/([^/]+)\/retry$/);
  if (adminFinancePayoutRetryMatch) {
    const payoutId = adminFinancePayoutRetryMatch[1];
    return `${API_BASE}/admin/finance/payouts/${payoutId}/retry`;
  }

  // Check if endpoint is for admin orders summary - route to local API
  const adminOrdersSummaryMatch = endpoint.match(/^api\/admin\/orders\/summary$/);
  if (adminOrdersSummaryMatch) {
    return `${API_BASE}/admin/orders/summary`;
  }

  // Check if endpoint is for admin orders list - route to local API
  const adminOrdersMatch = endpoint.match(/^api\/admin\/orders$/);
  if (adminOrdersMatch) {
    return `${API_BASE}/admin/orders`;
  }

  // Check if endpoint is for admin order escalate - route to local API
  const adminOrderEscalateMatch = endpoint.match(/^api\/admin\/orders\/([^/]+)\/escalate$/);
  if (adminOrderEscalateMatch) {
    const orderId = adminOrderEscalateMatch[1];
    return `${API_BASE}/admin/orders/${orderId}/escalate`;
  }

  // Check if endpoint is for admin order resolve - route to local API
  const adminOrderResolveMatch = endpoint.match(/^api\/admin\/orders\/([^/]+)\/resolve$/);
  if (adminOrderResolveMatch) {
    const orderId = adminOrderResolveMatch[1];
    return `${API_BASE}/admin/orders/${orderId}/resolve`;
  }

  // Check if endpoint is for admin order cancel - route to local API
  const adminOrderCancelMatch = endpoint.match(/^api\/admin\/orders\/([^/]+)\/cancel$/);
  if (adminOrderCancelMatch) {
    const orderId = adminOrderCancelMatch[1];
    return `${API_BASE}/admin/orders/${orderId}/cancel`;
  }

  // Check if endpoint is for admin order reassign - route to local API
  const adminOrderReassignMatch = endpoint.match(/^api\/admin\/orders\/([^/]+)\/reassign$/);
  if (adminOrderReassignMatch) {
    const orderId = adminOrderReassignMatch[1];
    return `${API_BASE}/admin/orders/${orderId}/reassign`;
  }

  // Check if endpoint is for admin analytics - route to local API
  const adminAnalyticsMatch = endpoint.match(/^api\/admin\/analytics$/);
  if (adminAnalyticsMatch) {
    return `${API_BASE}/admin/analytics`;
  }

  // Check if endpoint is for admin dashboard - route to local API
  const adminDashboardMatch = endpoint.match(/^api\/admin\/dashboard$/);
  if (adminDashboardMatch) {
    return `${API_BASE}/admin/dashboard`;
  }

  // Check if endpoint is for orders (POST/GET) - route to local API
  const ordersMatch = endpoint.match(/^api\/orders$/);
  if (ordersMatch) {
    return `${API_BASE}/orders`;
  }

  // Check if endpoint is for merchant orders - route to local API
  const merchantOrdersMatch = endpoint.match(/^api\/orders\/my-orders$/);
  if (merchantOrdersMatch) {
    return `${API_BASE}/orders/my-orders`;
  }

  // Check if endpoint is for nearest couriers - route to local API
  const nearestCouriersMatch = endpoint.match(/^api\/stores\/nearest-couriers$/);
  if (nearestCouriersMatch) {
    return `${API_BASE}/stores/nearest-couriers`;
  }

  // Check if endpoint is for courier schedule - route to local API
  const courierScheduleMatch = endpoint.match(/^api\/(courier|couriers)\/schedule$/);
  if (courierScheduleMatch) {
    return `${API_BASE}/courier/schedule`;
  }

  // Check if endpoint is for courier availability - route to local API
  const courierAvailabilityMatch = endpoint.match(/^api\/(courier|couriers)\/availability$/);
  if (courierAvailabilityMatch) {
    return `${API_BASE}/courier/availability`;
  }

  // Check if endpoint is for courier earnings - route to local API
  const courierEarningsMatch = endpoint.match(/^api\/(courier|couriers)\/earnings$/);
  if (courierEarningsMatch) {
    return `${API_BASE}/courier/earnings`;
  }

  // Check if endpoint is for courier history - route to local API
  const courierHistoryMatch = endpoint.match(/^api\/(courier|couriers)\/history$/);
  if (courierHistoryMatch) {
    return `${API_BASE}/courier/history`;
  }

  // Check if endpoint is for inventory list - route to local API
  const inventoryMatch = endpoint.match(/^api\/inventory$/);
  if (inventoryMatch) {
    return `${API_BASE}/inventory`;
  }

  // Check if endpoint is for low stock inventory - route to local API
  const lowStockInventoryMatch = endpoint.match(/^api\/inventory\/low-stock$/);
  if (lowStockInventoryMatch) {
    return `${API_BASE}/inventory/low-stock`;
  }

  // Check if endpoint is for inventory adjust - route to local API
  const inventoryAdjustMatch = endpoint.match(/^api\/inventory\/([^/]+)\/adjust$/);
  if (inventoryAdjustMatch) {
    const productId = inventoryAdjustMatch[1];
    return `${API_BASE}/inventory/${productId}/adjust`;
  }

  // Check if endpoint is for inventory threshold update - route to local API
  const inventoryThresholdMatch = endpoint.match(/^api\/inventory\/([^/]+)\/threshold$/);
  if (inventoryThresholdMatch) {
    const productId = inventoryThresholdMatch[1];
    return `${API_BASE}/inventory/${productId}/threshold`;
  }

  // Check if endpoint is for store customers list - route to local API
  const storeCustomersMatch = endpoint.match(/^api\/store-customers$/);
  if (storeCustomersMatch) {
    return `${API_BASE}/store-customers`;
  }

  // Check if endpoint is for store customer details - route to local API
  const storeCustomerDetailMatch = endpoint.match(/^api\/store-customers\/([^/]+)$/);
  if (storeCustomerDetailMatch) {
    const customerId = storeCustomerDetailMatch[1];
    return `${API_BASE}/store-customers/${customerId}`;
  }

  // Check if endpoint is for payouts summary - route to local API
  const payoutsSummaryMatch = endpoint.match(/^api\/payouts\/summary$/);
  if (payoutsSummaryMatch) {
    return `${API_BASE}/payouts/summary`;
  }

  // Check if endpoint is for payouts history - route to local API
  const payoutsHistoryMatch = endpoint.match(/^api\/payouts\/history$/);
  if (payoutsHistoryMatch) {
    return `${API_BASE}/payouts/history`;
  }

  // Check if endpoint is for payout request - route to local API
  const payoutsRequestMatch = endpoint.match(/^api\/payouts\/request$/);
  if (payoutsRequestMatch) {
    return `${API_BASE}/payouts/request`;
  }

  // Check if endpoint is for coupons list/create - route to local API
  const couponsMatch = endpoint.match(/^api\/coupons$/);
  if (couponsMatch) {
    return `${API_BASE}/coupons`;
  }

  // Check if endpoint is for coupon update/delete - route to local API
  const couponByIdMatch = endpoint.match(/^api\/coupons\/([^/]+)$/);
  if (couponByIdMatch) {
    const couponId = couponByIdMatch[1];
    return `${API_BASE}/coupons/${couponId}`;
  }

  // Check if endpoint is for coupon toggle - route to local API
  const couponToggleMatch = endpoint.match(/^api\/coupons\/([^/]+)\/toggle$/);
  if (couponToggleMatch) {
    const couponId = couponToggleMatch[1];
    return `${API_BASE}/coupons/${couponId}/toggle`;
  }

  // Check if endpoint is for specific product update (PUT) - route to local API
  const productUpdateMatch = endpoint.match(/^api\/products\/(.+)$/);
  if (productUpdateMatch) {
    const productId = productUpdateMatch[1];
    return `${API_BASE}/products/${productId}`;
  }

  // Check if endpoint is for merchant menu - route to local API
  const merchantMenuMatch = endpoint.match(/^api\/stores\/merchant\/(.+)\/menu$/);
  if (merchantMenuMatch) {
    const merchantId = merchantMenuMatch[1];
    return `${API_BASE}/stores/merchant/${merchantId}/menu`;
  }

  // Check if endpoint is for store menu/products - route to local API
  const storeMenuMatch = endpoint.match(/^api\/stores\/(.+)\/menu$/);
  if (storeMenuMatch) {
    const storeId = storeMenuMatch[1];
    return `${API_BASE}/stores/${storeId}/menu`;
  }

  // Check if endpoint is for chart tracks - route to local API
  const chartTracksMatch = endpoint.match(/^chart\/0\/tracks$/);
  if (chartTracksMatch) {
    return `${API_BASE}/products/top`;
  }
  
  // Check if endpoint is for album - route to local API
  const albumMatch = endpoint.match(/^album\/(.+)$/);
  if (albumMatch) {
    const storeId = albumMatch[1];
    return `${API_BASE}/stores/${storeId}/menu`;
  }
  
  // Check if endpoint is for editorial releases - route to local API
  const releasesMatch = endpoint.match(/^editorial\/(.+)\/releases$/);
  if (releasesMatch) {
    const categoryId = releasesMatch[1];
    return `${API_BASE}/stores/category/${categoryId}`;
  }
  
  // Check if endpoint is for all stores - route to local API
  const allStoresMatch = endpoint.match(/^stores\/all$/);
  if (allStoresMatch) {
    return `${API_BASE}/stores`;
  }
  
  // Check if endpoint is for top products by category - route to local API
  const topProductsMatch = endpoint.match(/^top\/category\/(.+)$/);
  if (topProductsMatch) {
    const categoryId = topProductsMatch[1];
    return `${API_BASE}/products/top/category/${categoryId}`;
  }
  
  // Check if endpoint is for all top products - route to local API
  const allTopProductsMatch = endpoint.match(/^products\/top\/all$/);
  if (allTopProductsMatch) {
    return `${API_BASE}/products/top`;
  }
  
  // Check if endpoint is for category by id - route to local API
  const categoryMatch = endpoint.match(/^api\/categories\/(.+)$/);
  if (categoryMatch) {
    return `${API_BASE}/categories/${categoryMatch[1]}`;
  }
  
  // Check if endpoint is for search - route to local API
  const searchMatch = endpoint.match(/^search\/(products|stores)\?q=(.+)$/);
  if (searchMatch) {
    return `${API_BASE}/${endpoint}`;
  }
  
  return `${CORS_URL}/${DEEZER_API_URL}/${endpoint}`;
};

export const apiQuery = async ({ endpoint, config, method = "GET" }) => {
  try {
    const baseUrl = getBaseUrl(endpoint);
    const token = localStorage.getItem("token");
    
    const options = {
      url: baseUrl,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      ...config,
    };

    const response = await axios(options);
    
    // Check if this is a local backend endpoint (standardized response)
    const isLocalBackend = baseUrl.startsWith(API_BASE);
    
    // If local backend and has standardized response structure, extract Data
    if (isLocalBackend && response.data && response.data.Data !== undefined) {
      const extractedData = response.data.Data;
      
      // If Data is an array, wrap it in a data property for consistency
      if (Array.isArray(extractedData)) {
        return { data: extractedData };
      }
      
      return extractedData;
    }
    
    // Otherwise return the raw response (for external APIs like Deezer)
    return response.data;
  } catch (error) {
    let err = error.response
      ? {
          message:
            error.response.data.responseMessage || error.response.data.error,
        }
      : error;
    throw new Error(err);
  }
};

export const dataFormatted = async (data) => {
  try {
    const dataMapped = data
      ? Object?.entries(data)?.map(async (dataItem) => {
          const key = dataItem[0];
          const { data: value } = dataItem[1] || {};

          let valueMappedPromise;
          const size = 20;

          if (!["tracks"].includes(key)) {
            const valueMapped = value?.slice(0, size)?.map((valueItem) => {
              try {
                const { tracklist } = valueItem;
                if (tracklist) {
                  return {
                    ...valueItem,
                  };
                } else {
                  return { ...valueItem, tracks: null };
                }
              } catch (error) {
                throw new Error(error);
              }
            });
            valueMappedPromise = await Promise.all(valueMapped);
          } else {
            valueMappedPromise = data;
          }
          return { [key]: { data: valueMappedPromise } };
        })
      : [];
    const dataMappedPromise = await Promise.all(dataMapped);

    const resultReduced = dataMappedPromise.reduce((acc, item) => {
      acc = Object.assign(acc, item);
      return acc;
    }, {});
    return resultReduced;
  } catch (error) {
    throw new Error(error);
  }
};

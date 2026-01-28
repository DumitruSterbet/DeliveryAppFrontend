import axios from "axios";
import imageCompression from "browser-image-compression";
const API_BASE = "https://localhost:7227/api";
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
export const apiRegister = async ({ email, password, username }) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      email,
      password,
      username,
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
    console.log("Uploading image:", {
      originalFileName: imageFile.name,
      providedFileName: fileName,
      finalFileName: finalFileName,
      folder: storagePath
    });
    
    formData.append("image", compressedFile, finalFileName);
    formData.append("folder", storagePath || "uploads");

    const response = await axios.post(`${API_BASE}/upload/image`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload response:", JSON.stringify(response.data));

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
  console.log("dima1");
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
  
  // Check if endpoint is for category by id - route to local API
  const categoryMatch = endpoint.match(/^api\/categories\/(.+)$/);
  if (categoryMatch) {
    return `${API_BASE}/categories/${categoryMatch[1]}`;
  }
  
  return `${CORS_URL}/${DEEZER_API_URL}/${endpoint}`;
};

export const apiQuery = async ({ endpoint, config, method = "GET" }) => {
  try {
    console.log("Test1 call");
    const baseUrl = getBaseUrl(endpoint);
    const options = {
      url: baseUrl,
      method,
      ...config,
    };

    const response = await axios(options);
    console.log("dima22",JSON.stringify(response.data));
    
    // Check if this is a local backend endpoint (standardized response)
    const isLocalBackend = baseUrl.startsWith(API_BASE);
    
    // If local backend and has standardized response structure, extract Data
    if (isLocalBackend && response.data && response.data.Data !== undefined) {
      console.log("dima33");
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

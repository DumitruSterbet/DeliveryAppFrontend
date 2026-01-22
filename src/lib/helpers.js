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

    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== END PROFILE API HELPERS ====================

export const uploadImage = async ({ imageFile, storagePath, fileName }) => {
  const compressImgOption = {
    maxSizeMB: 0.05,
    maxWidthOrHeight: 1000,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(imageFile, compressImgOption);

  const storageRef = ref(
    storage,
    `${storagePath}/${fileName || compressedFile.name}`
  );
  const snapshot = await uploadBytes(storageRef, compressedFile);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const fbAddDoc = async ({ data, collection }) => {
  const response = await axios.post(`${API_BASE}/${collection}`, data);
  return response.data;
};

/**
 * fbSetDoc → used for register
 * Example:
 * fbSetDoc({ collection: "auth/register", data })
 */
export const fbSetDoc = async ({ data, collection }) => {
  const response = await axios.post(`${API_BASE}/${collection}`, data);
  return response.data;
};

/**
 * fbGetDoc → GET /api/{collection}/{id}
 */
export const fbGetDoc = async ({ collection, id }) => {
  console.log("dima1");
  const response = await axios.get(`${API_BASE}/${collection}/${id}`);
  return response.data;
};

/**
 * fbUpdateDoc → PUT /api/{collection}/{id}
 */
export const fbUpdateDoc = async ({ data, collection, id }) => {
  const response = await axios.put(`${API_BASE}/${collection}/${id}`, data);
  return response.data;
};

/**
 * fbDeleteDoc → DELETE /api/{collection}/{id}
 */
export const fbDeleteDoc = async ({ collection, id }) => {
  const response = await axios.delete(`${API_BASE}/${collection}/${id}`);
  return response.data;
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
  return `${CORS_URL}/${DEEZER_API_URL}/${endpoint}`;
};

export const apiQuery = async ({ endpoint, config, method = "GET" }) => {
  try {
    console.log("Test1 call");
    const options = {
      url: getBaseUrl(endpoint),
      method,
      ...config,
    };

    const response = await axios(options);

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

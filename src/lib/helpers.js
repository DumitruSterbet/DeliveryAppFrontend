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

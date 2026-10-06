import axios from 'axios';
import { API_BASE_URL } from './config';
import useAuthStore from '../store/auth.store';
import useCacheStore from '../store/cache.store';
import { STORAGE_KEYS, clearAll, getString, setString } from '../utils/storage.utils';

const REQUEST_TIMEOUT = 15000;

const CACHEABLE_URLS = {
  '/academic/schedule': 'schedule',
  '/academic/calendar': 'calendar',
  '/campus/spaces': 'spaces',
  '/services/faq': 'faq',
  '/campus/plans': 'plans',
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token) => {
  pendingQueue.forEach((pending) => (error ? pending.reject(error) : pending.resolve(token)));
  pendingQueue = [];
};

const endSession = async () => {
  await clearAll();
  useCacheStore.getState().reset();
  useAuthStore.getState().setSessionExpired(true);
  useAuthStore.getState().clearAuth();
};

const isAuthUrl = (url) => String(url || '').startsWith('/auth/');

const handleNetworkError = (error) => {
  const cacheStore = useCacheStore.getState();
  cacheStore.setOffline(true);
  const cacheName = error.config ? CACHEABLE_URLS[error.config.url] : undefined;
  const cached = cacheName ? cacheStore[cacheName] : [];
  if (cacheName && cached.length > 0) {
    return Promise.resolve({
      data: { success: true, data: cached, message: 'Datos guardados' },
      status: 200,
      config: error.config,
      fromCache: true,
    });
  }
  return Promise.reject(error);
};

apiClient.interceptors.request.use(async (config) => {
  const token = await getString(STORAGE_KEYS.jwt);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (useCacheStore.getState().isOffline) {
      useCacheStore.getState().setOffline(false);
    }
    return response;
  },
  async (error) => {
    if (!error.response) {
      return handleNetworkError(error);
    }
    const original = error.config;
    if (error.response.status !== 401 || !original || original._retry || isAuthUrl(original.url)) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      });
    }

    isRefreshing = true;
    try {
      const refreshToken = await getString(STORAGE_KEYS.refresh);
      if (!refreshToken) {
        throw error;
      }
      const refreshResponse = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        { timeout: REQUEST_TIMEOUT },
      );
      const newToken = refreshResponse.data.data.accessToken;
      await setString(STORAGE_KEYS.jwt, newToken);
      flushQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      const lostConnection = axios.isAxiosError(refreshError) && !refreshError.response;
      if (lostConnection) {
        return handleNetworkError(error);
      }
      await endSession();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;

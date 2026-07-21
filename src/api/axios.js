import axios from 'axios';
import {
  getToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  isTokenValid,
  isTokenExpiringSoon,
} from '../utils/auth';
import { refreshAccessToken } from './auth';
import { getApiBaseUrl } from '../config/local';

const API_BASE_URL = getApiBaseUrl();
const PUBLIC_PATHS = ['/login', '/register', '/welcome', '/forgot-password', '/reset-password'];
const AUTH_SKIP_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh'];

let isRefreshing = false;
let refreshPromise = null;
let failedQueue = [];

function redirectToLogin() {
  const redirect = `${window.location.pathname}${window.location.search}`;
  const params = new URLSearchParams({
    session: 'expired',
    redirect,
  });
  window.location.href = `/login?${params.toString()}`;
}

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

async function performTokenRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const data = await refreshAccessToken(refreshToken);
  setTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

function enqueueRefresh() {
  if (refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = performTokenRefresh()
    .then((token) => {
      processQueue(null, token);
      return token;
    })
    .catch((error) => {
      processQueue(error, null);
      clearTokens();
      throw error;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

instance.interceptors.request.use(async (config) => {
  let token = getToken();

  if (
    token &&
    isTokenExpiringSoon(token) &&
    getRefreshToken() &&
    !AUTH_SKIP_REFRESH.some((path) => config.url?.includes(path))
  ) {
    try {
      token = await enqueueRefresh();
    } catch {
      // Fall through; response interceptor will handle auth failure.
    }
  }

  if (token && isTokenValid(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (token && getRefreshToken() && !AUTH_SKIP_REFRESH.some((path) => config.url?.includes(path))) {
    try {
      token = await enqueueRefresh();
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      clearTokens();
    }
  } else if (token) {
    clearTokens();
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthError = status === 401 || status === 403;
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');
    const isLoginRequest = originalRequest?.url?.includes('/auth/login');

    if (
      isAuthError &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !isLoginRequest &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            },
            reject,
          });
        });
      }

      try {
        const token = await enqueueRefresh();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        if (!PUBLIC_PATHS.includes(window.location.pathname)) {
          redirectToLogin();
        }
        return Promise.reject(refreshError);
      }
    }

    if (
      isAuthError &&
      !PUBLIC_PATHS.includes(window.location.pathname) &&
      !isLoginRequest &&
      !isRefreshRequest
    ) {
      clearTokens();

      if (!isLoginRequest) {
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  },
);

export default instance;

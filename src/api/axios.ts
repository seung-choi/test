import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getOriginURL } from '@/api/API_URL';
import type { ErrorResponse } from '@/types/api/error.type';
import { apiErrorHandler } from '@/utils/api/apiErrorHandler';
import { getErrorMessage } from '@/utils/api/getErrorMessage';

const isClient = typeof window !== 'undefined';
let errorCount = 0;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
const MAX_401_ERRORS = 5;

const $axios = axios.create({
  baseURL: isClient ? getOriginURL('api') : '',
  timeout: 50000,
  headers: {
    'accept': 'application/json',
  },
  withCredentials: true,
});

const tokens = {
  get access() {
    if (!isClient) return '';
    return window.localStorage.getItem('accessToken') ?? '';
  },
  set access(token: string) {
    if (!isClient) return;
    window.localStorage.setItem('accessToken', token);
  },
  get refresh() {
    if (!isClient) return '';
    return window.sessionStorage.getItem('refreshToken') ?? '';
  },
  set refresh(token: string) {
    if (!isClient) return;
    window.sessionStorage.setItem('refreshToken', token);
  },
};

const event = {
  get id() {
    if (!isClient) return '';
    return window.sessionStorage.getItem('eventId') ?? '';
  },
  set id(id: string) {
    if (!isClient) return;
    window.sessionStorage.setItem('eventId', id);
  },
};

const logoutAndRedirect = (message?: string) => {
  if (!isClient) return;
  if (message) {
    apiErrorHandler.emit(message, 'info');
  }
  window.sessionStorage.clear();
  window.localStorage.removeItem('accessToken');
  setTimeout(() => {
    window.location.href = '/login';
  }, 1500);
};

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async (): Promise<string> => {
  try {
    tokens.access = tokens.refresh;
    const response = await axios.patch(
      `${getOriginURL('api')}/auth/login`,
      {},
      {
        headers: {
          'Authorization': tokens.refresh,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    const newAccessToken = response.headers['access-token'];
    const newRefreshToken = response.headers['refresh-token'];

    if (newAccessToken) {
      tokens.access = newAccessToken;
    }
    if (newRefreshToken) {
      tokens.refresh = newRefreshToken;
    }

    return tokens.access;
  } catch (error) {
    throw error;
  }
};

$axios.interceptors.request.use(
  (config) => {
    const isFormData = config.data instanceof FormData;
    config.headers['Content-Type'] = isFormData ? 'multipart/form-data' : 'application/json';
    config.headers['Authorization'] = tokens.access;
    if (event.id) config.headers['Event-ID'] = event.id;
    return config;
  },
  (error) => Promise.reject(error)
);

$axios.interceptors.response.use(
  (response) => {
    const { headers } = response;

    if (headers['access-token']) {
      tokens.access = headers['access-token'];
    }
    if (headers['refresh-token']) {
      tokens.refresh = headers['refresh-token'];
    }

    errorCount = 0;
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status || error.status;
    const errorCode = error.response?.data?.code;
    const isLoginRequest = originalRequest?.url?.includes('/auth/login');

    // 네트워크 에러 처리
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      const message = error.code === 'ECONNABORTED'
        ? getErrorMessage('TIMEOUT')
        : getErrorMessage('NETWORK_ERROR');
      apiErrorHandler.emit(message, 'error');
      return Promise.reject({ ...error, code: 'NETWORK_ERROR' });
    }

    // 500번대 서버 에러 처리
    if (status && status >= 500) {
      apiErrorHandler.emit(getErrorMessage('INTERNAL_SERVER_ERROR', status), 'error');
      return Promise.reject(error);
    }

    // 401 토큰 만료 - Refresh Token으로 재발급 시도
    if (
      status === 401 &&
      errorCode === 'JWT_EXPIRED_TOKEN' &&
      !isLoginRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 대기
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = token;
            resolve($axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onTokenRefreshed(newToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = newToken;
        return $axios(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        logoutAndRedirect('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
        return Promise.reject(refreshError);
      }
    }

    // 401 인증 실패 (토큰 만료 외)
    if (status === 401 && !isLoginRequest) {
      errorCount++;
      if (errorCount >= MAX_401_ERRORS || errorCode === 'JWT_INVALID_TOKEN') {
        logoutAndRedirect(getErrorMessage(errorCode, status));
        return Promise.reject(error);
      }
      apiErrorHandler.emit(getErrorMessage(errorCode, status), 'error');
      return Promise.reject(error);
    }

    // 403 권한 없음
    if (status === 403) {
      apiErrorHandler.emit(getErrorMessage(errorCode, status), 'error');
      return Promise.reject(error);
    }

    // 400 잘못된 요청
    if (status === 400) {
      apiErrorHandler.emit(getErrorMessage(errorCode, status), 'error');
      return Promise.reject(error);
    }

    // 404 찾을 수 없음
    if (status === 404) {
      apiErrorHandler.emit(getErrorMessage(errorCode, status), 'error');
      return Promise.reject(error);
    }

    // 409 충돌
    if (status === 409) {
      apiErrorHandler.emit(getErrorMessage(errorCode, status), 'error');
      return Promise.reject(error);
    }

    // 그 외 에러
    if (status && status >= 400) {
      apiErrorHandler.emit(getErrorMessage(errorCode, status), 'error');
    }

    return Promise.reject(error);
  }
);

export default $axios;

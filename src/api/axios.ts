import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getOriginURL } from '@/api/API_URL';
import storage from '@/utils/storage';

interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}

const isClient = typeof window !== 'undefined';
let errorCount = 0;
const MAX_401_ERRORS = 5;

const $axios = axios.create({
  baseURL: isClient ? getOriginURL('api') : '',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
  },
  withCredentials: true,
});

const tokens = {
  get access() {
    return (storage.local.get('accessToken') as string) ?? '';
  },
  set access(token: string) {
    storage.local.set({ accessToken: token });
  },
  get refresh() {
    return (storage.local.get('refreshToken') as string) ?? '';
  },
  set refresh(token: string) {
    storage.local.set({ refreshToken: token });
  },
};

const logoutAndRedirect = () => {
  if (!isClient) return;
  storage.local.clear();
  window.location.href = '/login';
};

$axios.interceptors.request.use(
  (config) => {
    const { headers } = config;
    headers['Authorization'] = tokens.access;
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
    if (error?.status && error.status > 500) {
      if (isClient) location.reload();
      return Promise.reject(error);
    }

    if (
      error.status === 401 &&
      error.config?.url !== '/auth/login' &&
      error.response?.data?.code === 'JWT_EXPIRED_TOKEN'
    ) {
      tokens.access = tokens.refresh;
      await $axios({
        url: `${getOriginURL('api', '/auth/login')}`,
        method: 'patch',
        data: {},
      });
      return $axios(error.config as AxiosRequestConfig);
    }

    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      return Promise.reject(error);
    }

    if (error.status === 401) {
      errorCount++;
      if (errorCount >= MAX_401_ERRORS) {
        logoutAndRedirect();
      }
    }

    return Promise.reject(error);
  }
);

export default $axios;

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getOriginURL } from '@/api/API_URL';

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
    'accept': 'application/json',
  },
  withCredentials: true,
});

const tokens = {
  get access() {
    if (!isClient) return '';
    return window.sessionStorage.getItem('accessToken') ?? '';
  },
  set access(token: string) {
    if (!isClient) return;
    window.sessionStorage.setItem('accessToken', token);
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

const logoutAndRedirect = () => {
  if (!isClient) return;
  window.sessionStorage.clear();
  window.location.href = '/login';
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
    if (error?.status && error.status > 500) {
      if (isClient) location.reload();
      return;
    }

    if (
      error.status === 401 &&
      error.config?.url !== '/auth/login' &&
      error.response?.data?.code === 'JWT_EXPIRED_TOKEN'
    ) {
      tokens.access = tokens.refresh;
      await $axios.patch(`${getOriginURL('api', '/auth/login')}`, {});
      return $axios(error.config as AxiosRequestConfig);
    }

    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.error('ECONNABORTED Error || Network Error: ', error.code);
      return 'TIMEOUT';
    }

    if (error.status === 401) {
      errorCount++;
      if (errorCount >= MAX_401_ERRORS) {
        logoutAndRedirect();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default $axios;

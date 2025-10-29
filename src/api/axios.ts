import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getOriginURL } from "@/api/API_URL";
import storage from "@/utils/storage";

interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}

const isClient = typeof window !== "undefined";

// 401 에러 카운터 (5회 이상 발생 시 로그아웃 처리)
let errorCount = 0;
const MAX_401_ERRORS = 5;

// 토큰 갱신 중인지 추적하는 플래그 및 Promise
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

// 토큰 갱신 중일 때 요청을 저장하는 큐
let requestQueue: Array<() => void> = [];

// 요청 큐에 추가하는 함수
const addToQueue = (requestFn: () => void) => {
  requestQueue.push(requestFn);
};

// 큐에 있는 모든 요청 실행
const processQueue = () => {
  requestQueue.forEach((requestFn) => requestFn());
  requestQueue = [];
};

const $axios = axios.create({
  baseURL: isClient ? getOriginURL("api") : "",
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  withCredentials: true,
});

const tokens = {
  get access() {
    return (storage.local.get("accessToken") as string) ?? "";
  },
  set access(token: string) {
    storage.local.set({ accessToken: token });
  },
  get refresh() {
    return (storage.local.get("refreshToken") as string) ?? "";
  },
  set refresh(token: string) {
    storage.local.set({ refreshToken: token });
  },
};

// 토큰 갱신 함수
const refreshToken = async (): Promise<void> => {
  try {
    // 이미 갱신 중이면 현재 갱신 작업 반환
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
      tokens.access = tokens.refresh;
      await $axios({
        url: `${getOriginURL("api", "/auth/login")}`,
        method: "patch",
        data: {},
      });
    })();

    await refreshPromise;

    // 토큰 갱신 완료 후 큐에 있는 모든 요청 실행
    processQueue();

    isRefreshing = false;
    refreshPromise = null;
  } catch (error) {
    isRefreshing = false;
    refreshPromise = null;
    requestQueue = []; // 에러 발생 시 큐 초기화
    throw error;
  }
};

// 로그아웃 및 리다이렉트 함수
const logoutAndRedirect = () => {
  if (!isClient) return;
  storage.local.clear();
  window.location.href = "/login";
};

$axios.interceptors.request.use(
  (config) => {
    const { headers } = config;

    headers["Authorization"] = tokens.access;

    return config;
  },
  (error) => {
    console.error(error);

    return Promise.reject(error);
  },
);

$axios.interceptors.response.use(
  (response) => {
    const { headers } = response;

    if (headers["access-token"]) {
      tokens.access = headers["access-token"];
    }
    if (headers["refresh-token"]) {
      tokens.refresh = headers["refresh-token"];
    }

    // 성공적인 요청 시 401 에러 카운터 리셋
    errorCount = 0;

    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 500 초과일 경우 페이지 새로고침
    if (error?.status && error.status > 500) {
      location.reload();
      return;
    }

    // 토큰 만료 에러 처리
    if (
      error.status === 401 &&
      originalRequest?.url !== "/auth/login" &&
      error.response?.data?.code === "JWT_EXPIRED_TOKEN" &&
      !originalRequest._retry
    ) {
      // 이미 토큰 갱신 중이면 요청을 큐에 추가
      if (isRefreshing) {
        return new Promise((resolve) => {
          addToQueue(() => {
            // 토큰 갱신 완료 후 원래 요청 재시도
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = tokens.access;
            }
            resolve($axios(originalRequest));
          });
        });
      }

      // 토큰 갱신 시작
      originalRequest._retry = true;

      try {
        await refreshToken();
        // 원래 요청에 새 토큰 적용
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = tokens.access;
        }
        return $axios(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃
        logoutAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    // 네트워크 에러 처리
    if ("ECONNABORTED" === error.code || "Network Error" === error.message) {
      console.error("ECONNABORTED Error || Network Error: ", error.code);
      return "TIMEOUT";
    }

    // 기타 401 에러 처리
    if (error.status === 401) {
      errorCount++;
      // 5회 이상 401 에러 발생 시 로그아웃 처리
      if (errorCount >= MAX_401_ERRORS) {
        logoutAndRedirect();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default $axios;

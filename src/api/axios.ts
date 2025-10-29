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
    // 500 초과일 경우 페이지 새로고침
    if (error?.status && error.status > 500) {
      location.reload();
      return;
    }
    // 토큰 만료 에러 처리
    if (
      error.status === 401 &&
      error.config?.url !== "/auth/login" &&
      error.response?.data?.code === "JWT_EXPIRED_TOKEN"
    ) {
      tokens.access = tokens.refresh;
      // 토큰 갱신 시에는 절대 URL을 사용하여 baseURL이 중복으로 붙지 않도록 함
      await $axios({
        url: `${getOriginURL("api", "/auth/login")}`,
        method: "patch",
        data: {},
      });
      return $axios(error.config as AxiosRequestConfig);
    }

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

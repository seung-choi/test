import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getOriginURL } from "@/api/API_URL";
import storage from "@/utils/storage";

interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}

const isClient = typeof window !== "undefined";

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

$axios.interceptors.request.use(
  (config) => {
    const { headers } = config;

    headers["Authorization"] = tokens.access;

    return config;
  },
  (error) => {
    console.log(`request error : `, error);

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

    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    if (
      error.status === 401 &&
      error.config?.url !== "/mng/v1/auth/login" &&
      error.response?.data?.code === "JWT_EXPIRED_TOKEN"
    ) {
      tokens.access = tokens.refresh;
      await $axios.patch("/auth/login", {});
      return $axios(error.config as AxiosRequestConfig);
    }

    if ("ECONNABORTED" === error.code || "Network Error" === error.message) {
      console.log("ECONNABORTED Error || Network Error: ", error.code);
      return "TIMEOUT";
    }

    return Promise.reject(error);
  },
);

export default $axios;

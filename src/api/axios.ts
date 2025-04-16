import axios, { AxiosError } from "axios";
import { API_URL } from "@/api/API_URL";

interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}

const $axios = axios.create({
  baseURL: API_URL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  withCredentials: true,
});

const tokens = {
  get access() {
    return window.sessionStorage.getItem("accessToken") ?? "";
  },
  set access(token: string) {
    window.sessionStorage.setItem("accessToken", token);
  },
  get refresh() {
    return window.sessionStorage.getItem("refreshToken") ?? "";
  },
  set refresh(token: string) {
    window.sessionStorage.setItem("refreshToken", token);
  },
};

$axios.interceptors.request.use(
  (config) => {
    const { headers } = config;

    headers["Authorization"] = tokens.access;

    return config;
  },
  (error) => {
    console.log(`request error : `, error)

    return Promise.reject(error);
  }
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
    const { config, response } = error;

    if ("ECONNABORTED" === error.code || "Network Error" === error.message) {
      console.log("ECONNABORTED Error || Network Error: ", error.code);
      return "TIMEOUT";
    } else {
      if (response?.data) {
        console.log("response Error : ", response?.data);
      }
    }

    if (config) {
      tokens.access = tokens.refresh;

      if (response?.data?.status === 401 && response?.data.code === "JWT_EXPIRED_TOKEN") {
        try {
          const promise = new Promise((resolve, reject) => {
            setTimeout(async () => {
              try {
                const response = await $axios.patch("http://43.202.78.220:7110/auth/login");
                resolve(response);
              } catch (retryError) {
                reject(retryError);
              }
            }, 3000);
          });

          return promise.then(() => {
            return $axios(config);
          });
        } catch {
          return Promise.reject();
        }
      }
    }

    return Promise.reject(error);
  }
);

export default $axios;

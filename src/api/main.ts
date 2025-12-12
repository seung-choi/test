import $axios from "@/api/axios";
import { getOriginURL } from "@/api/API_URL";

// Type definitions
export interface LoginFormAPI {
  username: string;
  password: string;
}

export interface PassWordFormAPI {
  oldPassword: string;
  newPassword: string;
}

// POST
export const postLogin = async (data: LoginFormAPI) => {
  const res = await $axios({
    url: `${getOriginURL("api", "/auth/login")}`,
    method: "post",
    data: data,
  });
  return res.data;
};

//PATCH
export const patchPassword = async (data: PassWordFormAPI) => {
  const res = await $axios({
    url: "/password",
    method: "patch",
    data: data,
  });
  return res.data;
};

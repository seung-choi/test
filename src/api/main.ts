import $axios from "@/api/axios";
import { LoginFormAPI } from "@/app/login/page";
import { getOriginURL } from "@/api/API_URL";
import { PassWordFormAPI } from "@/app/repassword/page";

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

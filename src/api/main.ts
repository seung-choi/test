import $axios from "@/api/axios";
import { LoginFormAPI } from "@/app/login/page";
import { GPS_URL } from "@/api/API_URL";
import BookingType from "@/types/Booking.type";
import ClubType from "@/types/Club.type";
import EvetSSE from "@/types/EventSSE.type";
import {MapPinAPI} from "@/app/holecup/page";
import {PassWordFormAPI} from "@/app/repassword/page";

//GET
export const getClub = async () => {
  const res = await $axios<ClubType>({
    url: "/club",
    method: "get",
  });
  return res.data;
};

export const getBooking = async () => {
  const res = await $axios<BookingType[]>({
    url: `${GPS_URL}booking`,
    method: "get",
  });
  return res.data;
};

export const getEventSSE = async () => {
  const res = await $axios<EvetSSE[]>({
    url: "event/SSE",
    method: "get",
  });
  return res.data;
};

// POST
export const postLogin = async (data: LoginFormAPI) => {
  const res = await $axios({
    url: "http://43.202.78.220:7110/auth/login",
    method: "post",
    data: data,
  });
  return res.data;
};

export const postSendHis = async (formData: FormData) => {
  const res = await $axios({
    url: "send/his",
    method: "post",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const postMapPin = async (data: MapPinAPI[]) => {
  const res = await $axios({
    url: "map/pin",
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

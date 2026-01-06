import $axios from "@/api/axios";
import { getOriginURL } from "@/api/API_URL";
import { ApiClubType } from "@/types/club.type";
import { GpsBookingListType, GpsBookingType } from "@/types/booking.type";
import {ApiTagListType} from "@/types/tag.type";

/**
 * 골프장 정보 조회
 * @returns ApiClubType - 골프장 상세 정보 (코스, 홀, 맵 정보 포함)
 */
export const getClubInfo = async (): Promise<ApiClubType> => {
  const res = await $axios({
    url: `${getOriginURL("api", "/monitoring/v1/club")}`,
    method: "get",
  });
  return res.data;
};

/**
 * 예약 및 플레이 목록 조회
 * @returns GpsBookingListType - 현재 진행중인 예약/플레이 목록
 */
export const getBookingList = async (): Promise<GpsBookingListType> => {
  const res = await $axios({
    url: `${getOriginURL("gps", "/monitoring/v1/booking")}`,
    method: "get",
  });
  return res.data;
};

/**
 * 특정 예약 상세 정보 조회
 * @param bookingId - 예약 ID
 * @returns GpsBookingType - 예약 상세 정보
 */
export const getBookingDetail = async (bookingId: string): Promise<GpsBookingType> => {
  const res = await $axios({
    url: `${getOriginURL("gps", "/monitoring/v1/booking")}/${bookingId}`,
    method: "get",
  });
  return res.data;
};

/**
 * 태그 목록 조회
 * @returns ApiTagListType - 태그 목록 (팀 정보)
 */
export const getTagList = async (): Promise<ApiTagListType> => {
  const res = await $axios({
    url: `${getOriginURL("api", "/monitoring/v1/tag")}`,
    method: "get",
  });
  return res.data;
};

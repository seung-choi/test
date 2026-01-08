import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';
import { ApiClubType } from '@/types/club.type';
import { GpsBookingListType, GpsBookingType } from '@/types/booking.type';
import { ApiTagListType } from '@/types/tag.type';

export const getClubInfo = async (): Promise<ApiClubType> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/monitoring/v1/club')}`,
    method: 'get',
  });
  return res.data;
};

export const getBookingList = async (): Promise<GpsBookingListType> => {
  const res = await $axios({
    url: `${getOriginURL('gps', '/monitoring/v1/booking')}`,
    method: 'get',
  });
  return res.data;
};

export const getBookingDetail = async (bookingId: string): Promise<GpsBookingType> => {
  const res = await $axios({
    url: `${getOriginURL('gps', '/monitoring/v1/booking')}/${bookingId}`,
    method: 'get',
  });
  return res.data;
};

export const getTagList = async (): Promise<ApiTagListType> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/monitoring/v1/tag')}`,
    method: 'get',
  });
  return res.data;
};

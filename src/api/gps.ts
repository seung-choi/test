import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';
import { API_ENDPOINTS } from '@/api/endpoints';
import { GpsBookingListType, GpsBookingType } from '@/types/booking.type';

export const getBookingList = async (): Promise<GpsBookingListType> => {
  const res = await $axios({
    url: `${getOriginURL('gps')}${API_ENDPOINTS.GPS.BOOKING_LIST}`,
    method: 'get',
  });
  return res.data;
};

export const getBookingDetail = async (bookingId: string): Promise<GpsBookingType> => {
  const res = await $axios({
    url: `${getOriginURL('gps')}${API_ENDPOINTS.GPS.BOOKING_DETAIL(bookingId)}`,
    method: 'get',
  });
  return res.data;
};
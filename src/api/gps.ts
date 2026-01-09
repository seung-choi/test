import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';
import { GpsBookingListType, GpsBookingType } from '@/types/booking.type';

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
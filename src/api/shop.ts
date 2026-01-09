import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';
import { ApiClubType } from '@/types/club.type';

export const getShopInfo = async (): Promise<ApiClubType> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/fnb/v1/shop')}`,
    method: 'get',
  });
  return res.data;
};

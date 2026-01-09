import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';
import { ApiShopType } from '@/types/shop.type';

export const getShopInfo = async (): Promise<ApiShopType> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/fnb/v1/shop')}`,
    method: 'get',
  });
  return res.data;
};

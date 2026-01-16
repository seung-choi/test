import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ApiShopType } from '@/types/api/shop.type';

export const getShopInfo = async (): Promise<ApiShopType> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.SHOP.INFO}`,
    method: 'get',
  });
  return res.data;
};

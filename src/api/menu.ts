import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';

export const getMenuHisList = async (): Promise<unknown> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/fnb/v1/menu/his')}`,
    method: 'get',
  });
  return res.data;
};

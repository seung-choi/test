import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { CategoryApiType, GetCategoryResponse, PostCategoryRequest } from '@/types/api/category.type';

export type { CategoryApiType, GetCategoryResponse, PostCategoryRequest };

export const getCategoryList = async (categoryType: CategoryApiType): Promise<GetCategoryResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.CATEGORY.LIST(categoryType)}`,
    method: 'get',
  });
  return res.data;
};

export const getCategoryErpList = async (): Promise<GetCategoryResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.CATEGORY.ERP}`,
    method: 'get',
  });
  return res.data;
};

export const postCategoryList = async (
  categoryType: CategoryApiType,
  data: PostCategoryRequest[]
): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.CATEGORY.LIST(categoryType)}`,
    method: 'post',
    data,
  });
  return res.data;
};

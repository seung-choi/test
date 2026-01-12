import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';

export type CategoryType = 'REASON' | 'CATEGORY';

export interface GetCategoryResponse {
  categoryId: number;
  categoryNm: string;
  categoryOrd: number;
  categoryErp: string;
}

export interface PostCategoryRequest {
  categoryId?: number | null;
  categoryNm: string;
  categoryOrd: number;
  categoryErp?: string;
}

export const getCategoryList = async (categoryType: CategoryType): Promise<GetCategoryResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api', `/fnb/v1/category/${categoryType}`)}`,
    method: 'get',
  });
  return res.data;
};

export const getCategoryErpList = async (): Promise<GetCategoryResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/fnb/v1/category/erp')}`,
    method: 'get',
  });
  return res.data;
};

export const postCategoryList = async (
  categoryType: CategoryType,
  data: PostCategoryRequest[]
): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api', `/fnb/v1/category/${categoryType}`)}`,
    method: 'post',
    data,
  });
  return res.data;
};

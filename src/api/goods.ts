import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';
import { API_ENDPOINTS } from '@/api/endpoints';
import type {
  GoodsChannel,
  GoodsOption,
  GoodsStatus,
  GetGoodsResponse,
  ErpGoodsListResponse,
  PostGoodsRequest,
  PutGoodsRequest,
} from '@/types/api/goods.type';

export type { GoodsChannel, GoodsOption, GoodsStatus, GetGoodsResponse, ErpGoodsListResponse, PostGoodsRequest, PutGoodsRequest };

export const getGoodsList = async (): Promise<GetGoodsResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.GOODS.LIST}`,
    method: 'get',
  });
  return res.data;
};

export const getGoodsErpList = async (): Promise<ErpGoodsListResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.GOODS.ERP}`,
    method: 'get',
  });
  return res.data;
};

export const postGoodsInfo = async (data: PostGoodsRequest): Promise<void> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value instanceof File ? value : String(value));
    }
  });

  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.GOODS.LIST}`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const putGoodsInfo = async (goodsId: number, data: PutGoodsRequest): Promise<void> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value instanceof File ? value : String(value));
    }
  });

  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.GOODS.DETAIL(goodsId)}`,
    method: 'put',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const putGoodsErpList = async (): Promise<GetGoodsResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.GOODS.ERP}`,
    method: 'put',
  });
  return res.data;
};

export const patchGoodsStatusInfo = async (goodsId: number, goodsSt: GoodsStatus): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.GOODS.STATUS(goodsId, goodsSt)}`,
    method: 'patch',
  });
  return res.data;
};

export const patchGoodsOrderList = async (data: { goodsId: number; goodsOrd: number }[]): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.GOODS.ORDER}`,
    method: 'patch',
    data,
  });
  return res.data;
};

export const deleteGoodsList = async (goodsIdList: number[]): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.GOODS.LIST}`,
    method: 'delete',
    params: {
      goodsIdList,
    },
  });
  return res.data;
};

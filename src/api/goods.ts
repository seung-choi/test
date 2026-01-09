import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';

export type GoodsChannel = 'COS' | 'HUS' | 'BOTH';
export type GoodsOption = 'DINE' | 'TAKE' | 'BOTH';
export type GoodsStatus = 'D' | 'S' | 'N' | 'Y';

export interface GetGoodsResponse {
  goodsId: number;
  categoryId: number;
  categoryNm: string;
  goodsNm: string;
  goodsAmt: number;
  goodsCnt: string;
  goodsCh: GoodsChannel;
  goodsOp: GoodsOption;
  goodsTm: number;
  goodsImg: string;
  goodsOrd: number;
  goodsTag: string;
  goodsSt: GoodsStatus;
  goodsErp: string;
  createdDt: string;
  modifiedDt: string;
}

export interface ErpGoodsListResponse {
  goodsErp: string;
  goodsNm: string;
  goodsAmt: string;
  goodsCnt: string;
}

export interface PostGoodsRequest {
  categoryId: number;
  goodsNm: string;
  goodsAmt: number;
  goodsCnt: string;
  goodsCh: GoodsChannel;
  goodsOp: GoodsOption;
  goodsTm?: number;
  goodsImg?: File;
  goodsTag?: string;
  goodsErp?: string;
}

export interface PutGoodsRequest {
  categoryId: number;
  goodsNm: string;
  goodsAmt: number;
  goodsCnt: string;
  goodsCh: GoodsChannel;
  goodsOp: GoodsOption;
  goodsTm?: number;
  goodsImg?: File;
  goodsTag?: string;
}

export const getGoodsList = async (): Promise<GetGoodsResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/fnb/v1/goods')}`,
    method: 'get',
  });
  return res.data;
};

export const getGoodsErpList = async (): Promise<ErpGoodsListResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/fnb/v1/goods/erp')}`,
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
    url: `${getOriginURL('api', '/fnb/v1/goods')}`,
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
    url: `${getOriginURL('api', `/fnb/v1/goods/${goodsId}`)}`,
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
    url: `${getOriginURL('api', '/fnb/v1/goods/erp')}`,
    method: 'put',
  });
  return res.data;
};

export const patchGoodsStatusInfo = async (goodsId: number, goodsSt: GoodsStatus): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api', `/fnb/v1/goods/status/${goodsId}/${goodsSt}`)}`,
    method: 'patch',
  });
  return res.data;
};

export const patchGoodsOrderInfo = async (goodsId: number, goodsOrd: number): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api', `/fnb/v1/goods/order/${goodsId}/${goodsOrd}`)}`,
    method: 'patch',
  });
  return res.data;
};

export const deleteGoodsList = async (goodsIdList: number[]): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/fnb/v1/goods')}`,
    method: 'delete',
    params: {
      goodsIdList,
    },
  });
  return res.data;
};

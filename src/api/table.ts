import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';
import { API_ENDPOINTS } from '@/api/endpoints';

export interface GetTableResponse {
  tableId: number;
  tableNo: string;
  tableCd: string | null;
  tableXyr: string | null;
  tableWhp: string | null;
  tableOrd: number;
  tableErp: string | null;
  tableDiv: string | null;
  createdDt?: string;
  modifiedDt?: string;
}

export interface PostTableRequest {
  tableNo: string;
  tableOrd: number;
}

export interface PutTableRequest {
  tableId: number;
  tableCd: string | null;
  tableXyr: string | null;
  tableWhp: string | null;
}

export interface PatchTableRequest {
  tableId: number;
  tableOrd: number;
}

export const getTableList = async (): Promise<GetTableResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.TABLE.LIST}`,
    method: 'get',
  });
  return res.data;
};

export const getTableErpList = async (): Promise<GetTableResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.TABLE.ERP}`,
    method: 'get',
  });
  return res.data;
};

export const postTableInfo = async (data: PostTableRequest): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.TABLE.LIST}`,
    method: 'post',
    data,
  });
  return res.data;
};

export const putTableList = async (data: PutTableRequest[]): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.TABLE.LIST}`,
    method: 'put',
    data,
  });
  return res.data;
};

export const patchTableOrder = async (data: PatchTableRequest[]): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.TABLE.ORDER}`,
    method: 'patch',
    data,
  });
  return res.data;
};

export const deleteTableInfo = async (tableId: number): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.TABLE.DETAIL(tableId)}`,
    method: 'delete',
  });
  return res.data;
};

import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';

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

export const getTableList = async (): Promise<GetTableResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/fnb/v1/table')}`,
    method: 'get',
  });
  return res.data;
};

export const getTableErpList = async (): Promise<GetTableResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/fnb/v1/table/erp')}`,
    method: 'get',
  });
  return res.data;
};

export const postTableInfo = async (data: PostTableRequest): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/fnb/v1/table')}`,
    method: 'post',
    data,
  });
  return res.data;
};

export const putTableList = async (data: PutTableRequest[]): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api', '/fnb/v1/table')}`,
    method: 'put',
    data,
  });
  return res.data;
};

export const deleteTableInfo = async (tableId: number): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api', `/fnb/v1/table/${tableId}`)}`,
    method: 'delete',
  });
  return res.data;
};

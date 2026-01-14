import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';
import { API_ENDPOINTS } from '@/api/endpoints';
import {
  GetBillResponse,
  GetBillParams,
  PostBillRequest,
  PostBillResponse,
  PostOrderRequest,
  PutBillRequest,
  DeleteBillRequest,
  DeleteBillListRequest,
  GetOrderResponse,
  ErpBookingResponse,
  Bill,
} from '@/types/bill.type';

export const getBillList = async (params?: GetBillParams): Promise<GetBillResponse> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.BILL.LIST}`,
    method: 'get',
    params,
  });
  return res.data;
};

export const postBillInfo = async (data: PostBillRequest): Promise<PostBillResponse> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.BILL.CREATE}`,
    method: 'post',
    data,
  });
  return res.data;
};

export const postBillOrder = async (data: PostOrderRequest): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.BILL.ORDER}`,
    method: 'post',
    data,
  });
  return res.data;
};

export const getBillListByStatus = async (orderSt: string): Promise<Bill[]> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.BILL.BY_STATUS(orderSt)}`,
    method: 'get',
  });
  return res.data;
};

export const getBillOrderList = async (billId: number): Promise<GetOrderResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.BILL.ORDER_LIST(billId)}`,
    method: 'get',
  });
  return res.data;
};

export const putBillErpInfo = async (
  billId: number,
  tableId: number,
  data: PutBillRequest
): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.BILL.ACCEPT_WITH_ERP(billId, tableId)}`,
    method: 'put',
    data,
  });
  return res.data;
};

export const patchBillInfo = async (billId: number, tableId: number): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.BILL.ACCEPT_WITH_ERP(billId, tableId)}`,
    method: 'patch',
  });
  return res.data;
};

export const patchBillComplete = async (billId: number): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.BILL.DETAIL(billId)}`,
    method: 'patch',
  });
  return res.data;
};

export const deleteBillInfo = async (billId: number, data: DeleteBillRequest): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.BILL.DETAIL(billId)}`,
    method: 'delete',
    data,
  });
  return res.data;
};

export const deleteBillOrderList = async (
  billId: number,
  data: DeleteBillListRequest
): Promise<void> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.BILL.ORDER_LIST(billId)}`,
    method: 'delete',
    data,
  });
  return res.data;
};

export const getBillErpList = async (): Promise<ErpBookingResponse[]> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.BILL.ERP_LIST}`,
    method: 'get',
  });
  return res.data;
};

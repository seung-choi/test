import $axios from '@/api/axios';
import { getOriginURL } from '@/api/API_URL';
import { API_ENDPOINTS } from '@/api/endpoints';
import { EventMessageHistoryItem, PostEventMsgRequest } from '@/types/event.type';

export const postEventMsgSend = async (data: PostEventMsgRequest): Promise<void> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value instanceof File ? value : String(value));
    }
  });

  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.EVENT.MSG_SEND}`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getEventMsgHisList = async (): Promise<EventMessageHistoryItem[]> => {
  const res = await $axios({
    url: `${getOriginURL('api')}${API_ENDPOINTS.EVENT.MSG_HISTORY}`,
    method: 'get',
  });
  return res.data;
};

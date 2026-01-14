import { getOriginURL } from '@/api/API_URL';
import { API_ENDPOINTS } from '@/api/endpoints';

export const getSubscribePage = async (
  clubId: string,
  pageId: string,
  lastEventId?: string
): Promise<EventSource> => {
  const url = `${getOriginURL('api')}${API_ENDPOINTS.SUBSCRIBE.PAGE(clubId, pageId)}${
    lastEventId ? `?lastEventId=${lastEventId}` : ''
  }`;

  return new EventSource(url);
};

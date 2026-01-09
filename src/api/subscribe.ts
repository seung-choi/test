import {getOriginURL} from '@/api/API_URL';

export const getSubscribePage = async (
  clubId: string,
  pageId: string,
  lastEventId?: string
): Promise<EventSource> => {
  const url = `${getOriginURL('api', `/fnb/v1/subscribe/${clubId}/${pageId}`)}${
    lastEventId ? `?lastEventId=${lastEventId}` : ''
  }`;

  return new EventSource(url);
};

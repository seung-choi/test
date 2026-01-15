export interface PostEventMsgRequest {
  fromId: string;
  fromNm: string;
  toId: string;
  toNm: string;
  eventCont: string;
  eventImg?: File;
}

export interface EventMessageHistoryItem {
  eventNo: number;
  eventsNo: number | null;
  eventsNm: string | null;
  fromId: string;
  fromNm: string;
  toId: string;
  toNm: string;
  eventCont: string;
  eventImg: string | null;
  createdDt: string;
}

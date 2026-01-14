export interface PostEventMsgRequest {
  fromId: string;
  fromNm: string;
  toId: string;
  toNm: string;
  eventCont: string;
  eventImg?: File;
}

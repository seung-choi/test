import { atom } from "recoil";
import { SSESOSData } from "@/types/sseType";

// SOS 팝업 아이템 타입 정의
export interface SOSPopupItem {
  id: string; // 고유 ID (eventNo + timestamp)
  data: SSESOSData; // SOS 데이터
  position: {
    marginTop: number; // 2px ~ 15px 사이의 랜덤 값
    marginLeft: number; // 2px ~ 15px 사이의 랜덤 값
  };
}

export const sseSOSState = atom<SSESOSData | null>({
  key: "sse/sos",
  default: null,
});

// SOS 팝업 목록 상태 (여러 팝업 관리)
export const sseSOSPopupListState = atom<SOSPopupItem[]>({
  key: "sseSOSPopupList",
  default: [],
});

export const sseSOSPopupOpenState = atom<boolean>({
  key: "sseSOSPopupOpenStates",
  default: false,
});

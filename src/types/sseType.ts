// SSE 이벤트 타입 정의
export type SSEEventType =
  | "subscribed" // 연결 성공
  | "PIN" // PIN 위치 변경
  | "SOS"; // SOS 긴급호출

// PIN 위치 변경 이벤트 데이터 타입
export interface SSEPinData {
  holeId: number;
  mapCd: string; // 맵 코드
  mapMode: string; // 맵 ID
  mapType: string;
  mapX: string; // X 좌표
  mapY: string; // Y 좌표
  mapZ: string; // 홀컵핀 색상
}

// SOS 이벤트 데이터 타입
export interface SSESOSData {
  bookingId: number; //예약 ID
  bookingNm: string; //예약명
  bookingTm: string; //예약시간
  courseId: number; //코스 ID
  courseNm: string; //코스명
  createdDt: string; //생성일시
  eventCont: string; //이벤트 내용
  eventId: number; //이벤트 ID
  eventMode: string; //이벤트 모드
  eventNo: number; //이벤트 번호
  eventX: string; //X 좌표
  eventY: string; //Y 좌표
  holeId: number; //홀 ID
  holeNo: number; //홀 번호
  playerId: number; //플레이어 ID
  playerNm: string; //플레이어명
}

// SSE 응답 데이터 유니온 타입
export type SSEResponseData =
  | string // subscribed, end 이벤트 (문자열)
  | SSEPinData[] // pin 이벤트 (배열)
  | SSESOSData; // SOS 이벤트

// SSE 연결 옵션 타입
export interface ConnectSSEOptions {
  onMessage: (type: SSEEventType, data: SSEResponseData) => void;
  onError?: (e: unknown) => void;
  signal?: AbortSignal;
}

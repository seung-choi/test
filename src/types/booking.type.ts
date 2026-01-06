// ==================== Booking API Response Types ====================

// Booking Type: 예약정보

export type VisitedHoleType = {
  outHoleList: {
    holeId: number;
    holeNo: number;
  }[];
  inHoleList: {
    holeId: number;
    holeNo: number;
  }[];
};

export interface Player {
  playerId: number;
  playerNm: string;
  playerGen: "F" | "M" | "X"; // 여성 | 남성 | 없음
  playerTel: string | null;
  playerOrd: number;
  playerSt: "P" | "C" | "W"; // 진행 | 완료 | 대기
  playerErp: string | null;
  sumScore: number | null;
}

export interface GpsBookingType {
  bookingId: number;
  bookingNm: string;
  bookingTm: string | null;
  bookingsNm: string | null;
  bookingsNo: string | null;
  bookingsSt: "Y" | "N"; // 단체팀 지정 여부
  bookingsCol: string | null;
  caddyId: number | null;
  caddyNm: string | null;
  courseId: number;
  courseNm: string | null;
  createdDate: string;
  delayTm: string | null;
  device: string;
  deviceNo: string | null;
  eventId: string | null;
  holeId: number | null;
  holeNo: number | null;
  id: string;
  inCourseId: number | null; // 후반대기ID
  inCourseNm: string | null;
  inStartTm: string | null;
  inEndTm: string | null;
  outRunTm: string; // 전반 진행시간
  inRunTm: string; // 후반 진행시간
  latitude: number | null;
  longitude: number | null;
  mode: string;
  outCourseId: number; // 전반코스 ID
  outCourseNm: string | null;
  outEndTm: string | null;
  outStartTm: string | null;
  playerId: string | null;
  playerList: Player[] | null;
  playerNm: string | null;
  progress: number | null;
  status: "OW" | "OP" | "IW" | "IP" | "CW" | "C"; // 전반대기 | 전반진행 | 후반대기 | 후반진행 | 종료대기 | 종료
  gap: boolean; // 현재 내가 홀간 영역 안에 존재하는지 유무
  tags: string[];
  cartNo: string | null;
  x: number | null;
  y: number | null;
  // GPS 서버만의 추가 필드가 있을 수 있음
  realTimeLocation?: {
    accuracy: number;
    timestamp: string;
  };
  emergencyCall?: boolean;
  currentSpeed?: number;
  visitedHole?: VisitedHoleType;
  gapList?: number[]; // 홀간 거리 영역이 있는 holeId 리스트
}

export type GpsBookingListType = GpsBookingType[];

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
  playerGen: 'F' | 'M' | 'X';
  playerTel: string | null;
  playerOrd: number;
  playerSt: 'P' | 'C' | 'W';
  playerErp: string | null;
  sumScore: number | null;
}

export interface GpsBookingType {
  bookingId: number;
  bookingNm: string;
  bookingTm: string | null;
  bookingsNm: string | null;
  bookingsNo: string | null;
  bookingsSt: 'Y' | 'N';
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
  inCourseId: number | null;
  inCourseNm: string | null;
  inStartTm: string | null;
  inEndTm: string | null;
  outRunTm: string;
  inRunTm: string;
  latitude: number | null;
  longitude: number | null;
  mode: string;
  outCourseId: number;
  outCourseNm: string | null;
  outEndTm: string | null;
  outStartTm: string | null;
  playerId: string | null;
  playerList: Player[] | null;
  playerNm: string | null;
  progress: number | null;
  status: 'OW' | 'OP' | 'IW' | 'IP' | 'CW' | 'C';
  gap: boolean;
  tags: string[];
  cartNo: string | null;
  x: number | null;
  y: number | null;
  realTimeLocation?: {
    accuracy: number;
    timestamp: string;
  };
  emergencyCall?: boolean;
  currentSpeed?: number;
  visitedHole?: VisitedHoleType;
  gapList?: number[];
}

export type GpsBookingListType = GpsBookingType[];

export interface GolferPositionData {
  bookingId: number;
  bookingNm: string;
  bookingTm: string | null;
  holeNo: number | null;
  course: string;
  outCourse: string;
  position: {
    left: string;
  };
  isGroup: boolean;
  bookingsCol: string | null;
}

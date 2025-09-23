import PlayerType from "@/types/Player.type";

type BookingType = {
  /* 코스 */
  courseId: number;
  courseNm: string;
  /* 전/후반 코스 */
  outCourseId: number;
  outCourseNm: string;
  inCourseId: number | null;
  inCourseNm: string | null;
  /* 전/후반 진행시간 */
  outRunTm: string;
  inRunTm: string;
  /* 홀 */
  holeId: number;
  holeNo: number;
  /* 캐디 */
  caddyId: number | null;
  caddyNm: string | null;
  /* 예약 */
  bookingId: number;
  bookingNm: string;
  bookingTm: string;
  bookingsNo: number | null;
  bookingsNm: string | null;

  playerList: PlayerType[];

  /* 노캐디 */
  playerId: number | null;
  playerNm: string | null;
  /* 기기 */
  deviceNo: string;
  /* 좌표: 픽셀(원본 기준) */
  x: number | null;
  y: number | null;
  /* 위경도: 실제 발생 */
  latitude: number;
  longitude: number;
  status: "OW" | "OP" | "IW" | "IP" | "C";
  /* 진행률: 퍼센트(시작점 기준) */
  progress: number;
  /* 전반 시작: HH:mm(시:분) */
  outStartTm: string | null;
  /* 전반 종료: HH:mm(시:분) */
  outEndTm: string | null;
  /* 후반 시작: HH:mm(시:분) */
  inStartTm: string | null;
  /* 후반 종료: HH:mm(시:분) */
  inEndTm: string | null;

  tags: string[];

  progressOutCourse: number[];
  progressInCourse: number[];

  mode: "PORTRAIT" | "LANDSCAPE";
};

export default BookingType;

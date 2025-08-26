type EventHisSOSType = {
  eventNo: number; // 이벤트 번호
  eventId: number; // 이벤트 ID
  eventMode: string;
  eventCont: string; // 이벤트 내용
  holeId: number; // 홀 ID
  holeNo: number; // 홀 번호
  courseId: number; // 코스 ID
  courseNm: string; // 코스명
  bookingId: number; // 예약 ID
  bookingNm: string; // 예약명
  bookingTm: string; // 예약 시간 (HH:mm 형식)
  playerId: number; // 플레이어 ID
  playerNm: string | null; // 플레이어명 (null 가능)
  eventX: string; // X좌표
  eventY: string; // Y좌표
  createdDt: string; // 생성일시 (yyyy-MM-dd HH:mm:ss 형식)
  createdBy: string; // 생성자 ID
  createdNm: string | null; // 생성자명 (null 가능)
  modifiedDt: string | null; // 수정일시 (yyyy-MM-dd HH:mm:ss 형식, null 가능)
  modifiedBy: string | null; // 수정자 ID (null 가능)
  modifiedNm: string | null; // 수정자명 (null 가능)
};

export default EventHisSOSType;

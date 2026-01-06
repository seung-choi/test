// ==================== Club API Response Types ====================

// Club Type: 클럽 데이터

export interface CourseMapListType {
  mapMode: "PORTRAIT" | "LANDSCAPE" | "ORIENTATION"; // 모드
  mapType: "DOM" | "GPS" | "IMG"; // 타입
  mapCd: string; // 코드
  mapX: string; // x값
  mapY: string; // y값
  mapZ: string | null; // z값
  mapUrl: string | null; // 이미지 url
}

// API 서버용 응답 타입들
export interface ApiMapType {
  mapMode: "PORTRAIT" | "LANDSCAPE"; // 세로 | 가로
  mapType: "DOM" | "GPS" | "IMG"; // DOM 기준 좌표 | 카카오/구글 지도 | 디자인 이미지
  mapCd: string;
  mapX: string | null;
  mapY: string | null;
  mapZ: string | null;
  mapUrl: string | null;
}

export interface ApiHoleType {
  holeId: number;
  holeNo: number;
  holePar: number | null;
  holeHdc: number | null;
  holeAlt: number | null;
  holePer: "N" | "Y"; // 미사용 | 사용
  holeWth: number; // 홀 너비
  holeGap: number; // 홀간 거리
  mapList: ApiMapType[];
}

export interface ApiCourseType {
  courseId: number;
  courseNm: string;
  courseCol: string | null;
  courseCnt: number | null;
  coursePar: number | null;
  courseErp: string | null;
  holeList: ApiHoleType[];
}

export interface ApiClubType {
  clubId: string;
  clubType: "FRONT" | "BACK" | "NONE"; // 현장 | 운영 | 없음
  clubMode: "PORTRAIT" | "LANDSCAPE"; // 세로 | 가로
  clubNm: string;
  clubAddr: string;
  clubTel: string;
  clubLat: number;
  clubLon: number;
  clubLogo: string | null;
  clubImg: string | null;
  clubDt: string; // "yyyy-MM-dd" 형식
  zoneCd: string;
  zoneNm: string;
  zoneId: string;
  greenSpd: number; // BigDecimal (소수점 1자리)
  frontDist: number;
  courseList: ApiCourseType[];
  courseMapList: CourseMapListType[];
}

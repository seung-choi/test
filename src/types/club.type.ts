export interface CourseMapListType {
  mapMode: 'PORTRAIT' | 'LANDSCAPE' | 'ORIENTATION';
  mapType: 'DOM' | 'GPS' | 'IMG';
  mapCd: string;
  mapX: string;
  mapY: string;
  mapZ: string | null;
  mapUrl: string | null;
}

export interface ApiMapType {
  mapMode: 'PORTRAIT' | 'LANDSCAPE';
  mapType: 'DOM' | 'GPS' | 'IMG';
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
  holePer: 'N' | 'Y';
  holeWth: number;
  holeGap: number;
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
  clubType: 'FRONT' | 'BACK' | 'NONE';
  clubMode: 'PORTRAIT' | 'LANDSCAPE';
  clubNm: string;
  clubAddr: string;
  clubTel: string;
  clubLat: number;
  clubLon: number;
  clubLogo: string | null;
  clubImg: string | null;
  clubDt: string;
  zoneCd: string;
  zoneNm: string;
  zoneId: string;
  greenSpd: number;
  frontDist: number;
  courseList: ApiCourseType[];
  courseMapList: CourseMapListType[];
}

import CourseType from "@/types/Course.type";

type ClubType = {
  clubId: string;
  clubNm: string;
  clubAddr: string;
  clubTel: string;
  clubLat: number;
  clubLon: number;
  clubLogo: string;
  clubImg: string;
  clubDt: string;
  clubQr: string | null;
  clubType: "NONE" | "BACK" | "FRONT";
  clubMode: "LANDSCAPE" | "PORTRAIT";
  zoneCd: "KR" | "US" | "JP" | "TH";
  zoneNm: string;
  zoneId: string;
  greenSpd: number | null;
  courseList: CourseType[];
};

export default ClubType;

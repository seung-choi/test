type CourseMapListType = {
  /** 모드 */
  mapMode: "PORTRAIT" | "LANDSCAPE" | "ORIENTATION";
  /** 타입 */
  mapType: "DOM" | "GPS" | "IMG";
  /** 코드 */
  mapCd: string;
  /** X값 */
  mapX: string;
  /** Y값 */
  mapY: string;
  /** Z값 */
  mapZ: string | null;
  /** URL */
  mapUrl: string | null;
};

export default CourseMapListType;

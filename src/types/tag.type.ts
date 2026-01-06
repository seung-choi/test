// ==================== Tag API Response Types ====================

// Tag Type: 태그 데이터 (팀 정보)

export interface ApiTagType {
  tagId: number;
  tagCd: string;
  tagNm: string;
  tagImg: string | null;
  tagOrd: number;
  tagSt: "Y" | "N"; // 사용 | 미사용
}

export type ApiTagListType = ApiTagType[];

export interface ApiTagType {
  tagId: number;
  tagCd: string;
  tagNm: string;
  tagImg: string | null;
  tagOrd: number;
  tagSt: 'Y' | 'N';
}

export type ApiTagListType = ApiTagType[];

export interface TagType {
  tagId?: number | null;
  tagCd: string;
  tagNm: string;
  tagOrd: number;
  tagSt: 'Y' | 'N';
  tagImg?: string;
}

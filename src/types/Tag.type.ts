export interface TagType {
  tagId?: number | null;
  tagCd: string;
  tagNm: string;
  tagOrd: number;
  tagSt: "Y" | "N";
  tagImg?: string;
}

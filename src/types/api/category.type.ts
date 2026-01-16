export type CategoryApiType = 'REASON' | 'CATEGORY';

export interface GetCategoryResponse {
  categoryId: number;
  categoryNm: string;
  categoryOrd: number;
  categoryErp: string;
}

export interface PostCategoryRequest {
  categoryId?: number | null;
  categoryNm: string;
  categoryOrd: number;
  categoryErp?: string;
}

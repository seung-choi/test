export type GoodsChannel = 'COS' | 'HUS' | 'BOTH';
export type GoodsOption = 'DINE' | 'TAKE' | 'BOTH';
export type GoodsStatus = 'S' | 'N' | 'Y';

export interface GetGoodsResponse {
  goodsId: number;
  categoryId: number;
  categoryNm: string;
  goodsNm: string;
  goodsAmt: number;
  goodsCnt: string;
  goodsCh: GoodsChannel;
  goodsOp: GoodsOption;
  goodsTm: number;
  goodsImg: string;
  goodsOrd: number;
  goodsTag: string;
  goodsSt: GoodsStatus;
  goodsErp: string;
  createdDt: string;
  modifiedDt: string;
}

export interface ErpGoodsListResponse {
  goodsErp: string;
  goodsNm: string;
  goodsAmt: string;
  goodsCnt: string;
}

export interface PostGoodsRequest {
  categoryId: number;
  goodsNm: string;
  goodsAmt: number;
  goodsCnt: string;
  goodsCh: GoodsChannel;
  goodsOp: GoodsOption;
  goodsTm?: number;
  goodsImg?: File;
  goodsTag?: string;
  goodsErp?: string;
}

export interface PutGoodsRequest {
  categoryId: number;
  goodsNm: string;
  goodsAmt: number;
  goodsCnt: string;
  goodsCh: GoodsChannel;
  goodsOp: GoodsOption;
  goodsTm?: number;
  goodsImg?: File;
  goodsTag?: string;
}

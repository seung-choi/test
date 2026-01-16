import type { GetGoodsResponse } from '@/types/api/goods.type';

export type MenuTableRow = GetGoodsResponse & {
  id: number;
  [key: string]: string | number | string[] | boolean | undefined;
};

import type { GetTableResponse } from '@/types/api/table.type';

export interface TableXYR {
  x: number;
  y: number;
  r: number;
}

export interface TableWHP {
  w: number;
  h: number;
  p: number;
}

export interface UseTableDataParams {
  tableList: GetTableResponse[];
  containerWidth: number;
  containerHeight: number;
}

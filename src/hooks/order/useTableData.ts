import { useMemo } from 'react';
import { TableData, TableType } from '@/types';
import { GetTableResponse } from '@/api/table';

interface TableXYR {
  x: number;
  y: number;
  r: number;
}

interface TableWHP {
  w: number;
  h: number;
  p: number;
}

const parseXYR = (value: string): TableXYR => {
  const [x, y, r] = value.split(',').map(Number);
  return {
    x: Number.isFinite(x) ? x : 0,
    y: Number.isFinite(y) ? y : 0,
    r: Number.isFinite(r) ? r : 0
  };
};

const parseWHP = (value: string): TableWHP => {
  const [w, h, p] = value.split(',').map(Number);
  return {
    w: Number.isFinite(w) ? w : 1920,
    h: Number.isFinite(h) ? h : 1080,
    p: Number.isFinite(p) ? p : 1
  };
};

interface UseTableDataParams {
  tableList: GetTableResponse[];
  containerWidth: number;
  containerHeight: number;
}

export const useTableData = ({
  tableList,
  containerWidth,
  containerHeight
}: UseTableDataParams): TableData[] => {
  return useMemo(() => {
    if (containerWidth === 0 || containerHeight === 0) {
      return [];
    }

    const pageColumns = 2;

    return tableList
      .filter((table) => Boolean(table.tableCd && table.tableXyr))
      .map((table) => {
        const { x, y, r } = parseXYR(table.tableXyr || '0,0,0');
        const { w, h, p } = parseWHP(table.tableWhp || '1920,1080,1');

        const scale = containerWidth / w;
        const pageIndex = Math.max(0, Math.floor(p) - 1);
        const pageRow = Math.floor(pageIndex / pageColumns);
        const pageCol = pageIndex % pageColumns;
        const pageOffsetX = pageCol * w * scale;
        const pageOffsetY = pageRow * h * scale;

        return {
          id: table.tableNo,
          type: table.tableCd as TableType,
          position: {
            left: x * scale + pageOffsetX,
            top: y * scale + pageOffsetY
          },
          reservation: null,
          status: 'empty',
          rotation: r,
          scale
        } satisfies TableData;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [tableList, containerWidth, containerHeight]);
};

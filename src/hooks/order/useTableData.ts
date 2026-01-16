import { useMemo } from 'react';
import { TableData, TableType, UseTableDataParams } from '@/types';
import { parseTableWHP, parseTableXYR } from '@/utils';

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
        const { x, y, r } = parseTableXYR(table.tableXyr);
        const { w, h, p } = parseTableWHP(table.tableWhp);

        const scale = 1;
        const pageIndex = Math.max(0, Math.floor(p) - 1);
        const pageRow = Math.floor(pageIndex / pageColumns);
        const pageCol = pageIndex % pageColumns;
        const pageOffsetX = pageCol * w;
        const pageOffsetY = pageRow * h;

        return {
          id: table.tableNo || String(table.tableId ?? ''),
          tableId: table.tableId ?? undefined,
          type: table.tableCd as TableType,
          position: {
            left: x + pageOffsetX,
            top: y + pageOffsetY
          },
          rotation: r,
          scale
        } satisfies TableData;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [tableList, containerWidth, containerHeight]);
};

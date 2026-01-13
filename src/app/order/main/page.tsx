'use client';

import React, { useMemo, useRef, useState } from 'react';
import TableSeat from '@/components/order/main/TableSeat';
import TableItem from '@/components/order/main/TableItem';
import styles from '@/styles/pages/order/main.module.scss';
import OrderHeader from '@/components/order/main/Header';
import { useTableList } from '@/hooks/api';
import { useContainerSize } from '@/hooks/order/useContainerSize';
import { useTableData } from '@/hooks/order/useTableData';

const OrderMainPage: React.FC = () => {
  const [isTableMode, setIsTableMode] = useState(true);
  const { data: tableList = [] } = useTableList();
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useContainerSize(containerRef, isTableMode);

  const handleModeChange = (tableMode: boolean) => {
    setIsTableMode(tableMode);
  };

  const tableData = useTableData({
    tableList,
    containerWidth: containerSize.width,
    containerHeight: containerSize.height
  });

  const layoutSize = useMemo(() => {
    if (containerSize.width === 0) {
      return { width: 0, height: 0 };
    }

    const pageColumns = 2;
    let maxPage = 1;
    let baseWidth = 1920;
    let baseHeight = 1080;

    tableList.forEach((table) => {
      const whp = table.tableWhp || '1920,1080,1';
      const [w, h, p] = whp.split(',').map(Number);
      if (Number.isFinite(w) && w > 0) baseWidth = w;
      if (Number.isFinite(h) && h > 0) baseHeight = h;
      if (Number.isFinite(p) && p > maxPage) maxPage = Math.floor(p);
    });

    const scale = containerSize.width / baseWidth;
    const columns = Math.min(pageColumns, maxPage);
    const rows = Math.ceil(maxPage / pageColumns);
    return {
      width: baseWidth * scale * columns,
      height: baseHeight * scale * rows
    };
  }, [containerSize.width, tableList]);

  const seatData = useMemo(() => {
    return tableList.map((table) => ({
      id: `seat-${table.tableId}`,
      time: '--:--',
      customerName: undefined,
      groupName: undefined,
      members: undefined,
      tableNumber: table.tableNo,
      isEmpty: true
    }));
  }, [tableList]);

  return (
    <div className={styles.mainPage}>
      <OrderHeader
        isTableMode={isTableMode}
        onModeChange={handleModeChange}
        storeName="스타트 하우스"
        currentTime="PM 01:45"
        batteryLevel={50}
      />
      <div className={styles.contentArea}>
        {isTableMode ? (
          <div className={styles.tableLayoutContainer} ref={containerRef}>
            <div
              className={styles.layoutSpacer}
              style={{ width: layoutSize.width, height: layoutSize.height }}
            />
            {tableData.map((table, index) => (
              <TableItem key={`${table.id}-${index}`} table={table} />
            ))}
          </div>
        ) : (
          <TableSeat seats={seatData} />
        )}
      </div>
    </div>
  );
};

export default OrderMainPage;

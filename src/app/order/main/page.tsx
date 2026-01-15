'use client';

import React, { useMemo, useRef, useState } from 'react';
import TableSeat from '@/components/order/main/TableSeat';
import TableItem from '@/components/order/main/TableItem';
import styles from '@/styles/pages/order/main.module.scss';
import OrderHeader from '@/components/order/main/Header';
import { useBillListByStatus, useTableList } from '@/hooks/api';
import { useContainerSize } from '@/hooks/order/useContainerSize';
import { useTableData } from '@/hooks/order/useTableData';
import { TableData } from '@/types';
import { Bill } from '@/types/bill.type';

const formatTime = (value?: string | null): string => {
  if (!value) return '00:00';
  const match = value.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }
  return value;
};

const OrderMainPage: React.FC = () => {
  const [isTableMode, setIsTableMode] = useState(true);
  const { data: tableList = [] } = useTableList();
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useContainerSize(containerRef, isTableMode);
  const { billList = [] } = useBillListByStatus('P', { refetchInterval: 5000 });

  const billByTableId = useMemo(() => {
    const map = new Map<number, Bill>();
    billList.forEach((bill) => {
      if (!bill.tableId) return;
      const current = map.get(bill.tableId);
      if (!current) {
        map.set(bill.tableId, bill);
        return;
      }
      const currentTime = Date.parse(current.modifiedDt || current.createdDt || '');
      const nextTime = Date.parse(bill.modifiedDt || bill.createdDt || '');
      if ((Number.isNaN(currentTime) ? 0 : currentTime) <= (Number.isNaN(nextTime) ? 0 : nextTime)) {
        map.set(bill.tableId, bill);
      }
    });
    return map;
  }, [billList]);

  const handleModeChange = (tableMode: boolean) => {
    setIsTableMode(tableMode);
  };

  const tableData = useTableData({
    tableList,
    containerWidth: containerSize.width,
    containerHeight: containerSize.height
  });

  const mappedTableData = useMemo<TableData[]>(() => {
    const tableIdByNo = new Map<string, number>();
    tableList.forEach((table) => {
      if (table.tableNo && table.tableId) {
        tableIdByNo.set(table.tableNo, table.tableId);
      }
    });

    return tableData.map((table) => {
      const tableId = tableIdByNo.get(table.id);
      const bill = tableId ? billByTableId.get(tableId) : undefined;
      if (!bill) {
        return table;
      }

      return {
        ...table,
        reservation: {
          time: formatTime(bill.bookingTm),
          name: bill.bookingNm || undefined,
          group: bill.bookingsNm || undefined,
        },
        status: 'occupied' as const,
      };
    });
  }, [tableData, tableList, billByTableId]);

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

    const columns = Math.min(pageColumns, maxPage);
    const rows = Math.ceil(maxPage / pageColumns);
    return {
      width: baseWidth * columns,
      height: baseHeight * rows
    };
  }, [containerSize.width, tableList]);

  const seatData = useMemo(() => {
    return tableList.map((table) => {
      const bill = table.tableId ? billByTableId.get(table.tableId) : undefined;
      const members = bill?.playerList
        ? bill.playerList.split(',').map((member) => member.trim()).filter(Boolean)
        : undefined;

      return {
        id: `seat-${table.tableId}`,
        time: formatTime(bill?.bookingTm),
        customerName: bill?.bookingNm || undefined,
        groupName: bill?.bookingsNm || undefined,
        members,
        tableNumber: table.tableNo || '-',
        isEmpty: !bill
      };
    });
  }, [tableList, billByTableId]);

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
            {mappedTableData.map((table, index) => (
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

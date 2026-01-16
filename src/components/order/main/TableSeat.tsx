'use client';

import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TableCard from '@/components/common/TableCard';
import styles from '@/styles/components/order/main/tableSeat.module.scss';
import type { TableSeatProps } from '@/types';

const TableSeat: React.FC<TableSeatProps> = ({ tables, billsByTableId }) => {
  const router = useRouter();

  const handleSeatClick = useCallback((
    tableNumber: string,
    tableId: number | undefined,
    billId: number | undefined,
    bookingsNm: string,
    playerList: string[]
  ) => {
    const params = new URLSearchParams({
      tableNumber,
      bookingsNm,
      playerList: playerList.join(','),
    });
    if (typeof tableId === 'number') {
      params.set('tableId', String(tableId));
    }
    if (typeof billId === 'number') {
      params.set('billId', String(billId));
    }
    if (!billId) {
      router.push(`/order/assign?${params.toString()}`);
      return;
    }

    router.push(`/order/order?${params.toString()}`);
  }, [router]);

  return (
    <div className={styles.seatsContainer}>
      {tables.map((table) => {
        const bill = table.tableId ? billsByTableId.get(table.tableId) : undefined;
        const playerList = bill?.playerList
          ? bill.playerList.split(',').map((member) => member.trim()).filter(Boolean)
          : [];

        return (
          <TableCard
            key={`seat-${table.tableId}`}
            table={table}
            bill={bill}
            onClick={() => handleSeatClick(
              table.tableNo || '-',
              table.tableId ?? undefined,
              bill?.billId,
              bill?.bookingsNm || '',
              playerList
            )}
          />
        );
      })}
    </div>
  );
};

export default memo(TableSeat);

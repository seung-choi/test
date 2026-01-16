'use client';

import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TableCard from '@/components/common/TableCard';
import styles from '@/styles/components/order/main/tableSeat.module.scss';
import type { SeatData, TableSeatProps } from '@/types';

const TableSeat: React.FC<TableSeatProps> = ({ seats }) => {
  const router = useRouter();

  const handleSeatClick = useCallback((seat: SeatData) => {
    const params = new URLSearchParams({
      tableNumber: seat.tableNumber,
      groupName: seat.groupName || '',
      members: seat.members?.join(',') || ''
    });
    if (typeof seat.tableId === 'number') {
      params.set('tableId', String(seat.tableId));
    }
    if (typeof seat.billId === 'number') {
      params.set('billId', String(seat.billId));
    }
    if (seat.isEmpty) {
      router.push(`/order/assign?${params.toString()}`);
      return;
    }

    router.push(`/order/order?${params.toString()}`);
  }, [router]);

  return (
    <div className={styles.seatsContainer}>
      {seats.map((seat) => (
        <TableCard
          key={seat.id}
          id={seat.id}
          time={seat.time}
          customerName={seat.customerName}
          groupName={seat.groupName}
          members={seat.members}
          tableNumber={seat.tableNumber}
          isEmpty={seat.isEmpty}
          onClick={() => handleSeatClick(seat)}
        />
      ))}
    </div>
  );
};

export default memo(TableSeat);

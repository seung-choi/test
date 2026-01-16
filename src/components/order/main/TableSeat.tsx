'use client';

import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TableCard from '@/components/common/TableCard';
import styles from '@/styles/components/order/main/tableSeat.module.scss';

interface SeatData {
  id: string;
  tableId?: number;
  time: string;
  customerName?: string;
  groupName?: string;
  members?: string[];
  tableNumber: string;
  isEmpty: boolean;
}

interface TableSeatProps {
  seats: SeatData[];
}

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

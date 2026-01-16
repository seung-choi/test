'use client';

import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TableShape from '@/components/common/TableShape';
import type { TableItemProps } from '@/types';
import { formatTime } from '@/utils';

const TableItem: React.FC<TableItemProps> = ({ table, bill }) => {
  const router = useRouter();
  const { id, tableId, type, position, rotation, scale } = table;
  const displayScale = (scale ?? 1) * 1.06;
  const members = bill?.playerList
    ? bill.playerList.split(',').map((member) => member.trim()).filter(Boolean)
    : undefined;
  const reservation = bill ? {
    time: formatTime(bill.bookingTm, { emptyValue: '00:00' }),
    bookingNm: bill.bookingNm ?? undefined,
    bookingsNm: bill.bookingsNm ?? undefined,
  } : undefined;
  const status = bill ? 'occupied' as const : 'empty' as const;
  const billId = bill?.billId;

  const handleTableClick = useCallback(() => {
    const params = new URLSearchParams({
      tableNumber: id,
      bookingsNm: reservation?.bookingsNm || '',
      bookingNm: reservation?.bookingNm || '',
      bookingTm: reservation?.time || '',
    });
    if (typeof tableId === 'number') {
      params.set('tableId', String(tableId));
    }
    if (typeof billId === 'number') {
      params.set('billId', String(billId));
    }
    if (members && members.length > 0) {
      params.set('playerList', members.join(','));
    }

    if (status === 'empty') {
      router.push(`/order/assign?${params.toString()}`);
      return;
    }

    router.push(`/order/order?${params.toString()}`);
  }, [status, id, reservation, router, tableId, billId, members]);

  return (
    <TableShape
      type={type}
      variant="order"
      reservation={reservation ?? undefined}
      status={status}
      tableId={id}
      rotation={rotation}
      scale={displayScale}
      onClick={handleTableClick}
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top
      }}
    />
  );
};

export default memo(TableItem);

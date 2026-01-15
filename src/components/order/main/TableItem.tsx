'use client';

import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TableData } from '@/types';
import TableShape from '@/components/common/TableShape';

interface TableItemProps {
  table: TableData;
}

const TableItem: React.FC<TableItemProps> = ({ table }) => {
  const router = useRouter();
  const { id, type, position, reservation, status, rotation, scale } = table;
  const displayScale = (scale ?? 1) * 1.06;

  const handleTableClick = useCallback(() => {
    const params = new URLSearchParams({
      tableNumber: id,
      groupName: reservation?.group || '',
      customerName: reservation?.name || '',
      time: reservation?.time || ''
    });

    if (status === 'empty') {
      router.push(`/order/assign?${params.toString()}`);
      return;
    }

    router.push(`/order/order?${params.toString()}`);
  }, [status, id, reservation, router]);

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

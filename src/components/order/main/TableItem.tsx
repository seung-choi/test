'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TableData } from '@/types';
import TableShape from '@/components/common/TableShape';

interface TableItemProps {
    table: TableData;
}

const TableItem: React.FC<TableItemProps> = ({ table }) => {
    const router = useRouter();
    const { id, type, position, reservation, status } = table;

    const handleTableClick = () => {
        if (status === 'empty') return;

        const params = new URLSearchParams({
            tableNumber: id,
            groupName: reservation?.group || '',
            customerName: reservation?.name || '',
            time: reservation?.time || ''
        });

        router.push(`/order/order?${params.toString()}`);
    };

    return (
        <TableShape
            type={type}
            variant="order"
            reservation={reservation ?? undefined}
            status={status}
            tableId={id}
            onClick={handleTableClick}
            style={{
                position: 'absolute',
                left: position.left,
                top: position.top
            }}
        />
    );
};

export default TableItem;

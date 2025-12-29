'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TableCard from '@/components/common/TableCard';
import styles from '@/styles/components/order/main/tableSeat.module.scss';

interface SeatData {
    id: string;
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

const TableSeat: React.FC<TableSeatProps> = ({seats}) => {
    const router = useRouter();

    const handleSeatClick = (seat: SeatData) => {
        if (seat.isEmpty) return;

        const params = new URLSearchParams({
            tableNumber: seat.tableNumber,
            groupName: seat.groupName || '',
            members: seat.members?.join(',') || '',
        });

        router.push(`/order/order?${params.toString()}`);
    };

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

export default TableSeat;

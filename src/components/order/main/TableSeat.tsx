'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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

        // 테이블 정보를 쿼리 파라미터로 전달
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
                <div
                    key={seat.id}
                    className={`${styles.seatCard} ${seat.isEmpty ? styles.empty : styles.occupied}`}
                    onClick={() => handleSeatClick(seat)}
                    style={{ cursor: seat.isEmpty ? 'default' : 'pointer' }}
                >
                    <div className={styles.timeText}>{seat.time}</div>
                    {!seat.isEmpty && (
                        <>
                            <div className={styles.customerInfo}>
                                <div className={styles.customerName}>{seat.customerName}</div>
                                <div className={styles.groupName}>{seat.groupName}</div>
                            </div>

                            <div className={styles.membersList}>
                                {seat.members?.join(', ')}
                            </div>
                        </>
                    )}

                    <div className={styles.tableTab}>
                        <div className={styles.tableNumber}>{seat.tableNumber}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TableSeat;
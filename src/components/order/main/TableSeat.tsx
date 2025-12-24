import React from 'react';
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
    return (
        <div className={styles.seatsContainer}>
            {seats.map((seat) => (
                <div key={seat.id} className={`${styles.seatCard} ${seat.isEmpty ? styles.empty : styles.occupied}`}>
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
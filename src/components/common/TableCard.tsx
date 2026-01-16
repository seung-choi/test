'use client';

import React from 'react';
import styles from '@/styles/components/common/tableCard.module.scss';
import type { TableCardProps } from '@/types';
import { formatTime } from '@/utils';

const TableCard: React.FC<TableCardProps> = ({
    table,
    bill,
    onClick,
    variant = 'default',
    className = ''
}) => {
    const isEmpty = !bill;
    const tableNumber = table.tableNo || '-';
    const time = bill ? formatTime(bill.bookingTm, { emptyValue: '00:00' }) : '';
    const customerName = bill?.bookingNm || '';
    const groupName = bill?.bookingsNm || '';
    const members = bill?.playerList
        ? bill.playerList.split(',').map((member) => member.trim()).filter(Boolean)
        : [];
    return (
        <div
            className={`${styles.tableCard} ${isEmpty ? styles.empty : styles.occupied} ${variant === 'compact' ? styles.compact : ''} ${className}`}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {variant === 'default' && (
                <>
                    {time && <div className={styles.timeText}>{time}</div>}
                    {!isEmpty && (
                        <>
                            <div className={styles.customerInfo}>
                                {customerName && <div className={styles.customerName}>{customerName}</div>}
                                {groupName && <div className={styles.groupName}>{groupName}</div>}
                            </div>

                            {members.length > 0 && (
                                <div className={styles.membersList}>
                                    {members.join(', ')}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {variant === 'compact' && (
                <div className={styles.tableType}>T{tableNumber}</div>
            )}

            <div className={styles.tableTab}>
                <div className={styles.tableNumber}>T{tableNumber}</div>
            </div>
        </div>
    );
};

export default TableCard;

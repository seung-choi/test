'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TableData } from '@/types/order/tableSeat.type';
import styles from '@/styles/components/order/main/tableItem.module.scss';

interface TableItemProps {
    table: TableData;
}

const TableItem: React.FC<TableItemProps> = ({ table }) => {
    const router = useRouter();
    const { id, type, position, reservation, status } = table;

    const isOccupied = status === 'occupied';
    const borderColor = isOccupied ? '#9081D8' : '#959595';
    const footerColor = isOccupied ? '#6600FF' : '#D9D9D9';

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

    const baseDimensions = {
        '1x1': { width: 120, height: 120 },
        '1x2': { width: 120, height: 206 },
        '1x3': { width: 120, height: 292 },
        '1x4': { width: 120, height: 380 },
        '1x5': { width: 120, height: 475 },
        '2x1': { width: 206, height: 120 },
        '2x2': { width: 206, height: 206 },
        '3x1': { width: 292, height: 120 },
        '4x1': { width: 380, height: 120 },
        '5x1': { width: 475, height: 120 }
    };

    const { width, height } = baseDimensions[type];

    const render1x1 = () => (
        <div
            data-테이블={type}
            className={`${styles.tableContainer} ${styles.table1x1}`}
            style={{ width, height, left: position.left, top: position.top, cursor: status === 'empty' ? 'default' : 'pointer' }}
            onClick={handleTableClick}
        >
            <div className={styles.innerContent}>
                <div className={`${styles.time} ${reservation ? styles.timeWithReservation : styles.timeWithoutReservation}`}>
                    {reservation?.time || '00:00'}
                </div>
                {reservation?.name && (
                    <div className={styles.name}>
                        {reservation.name}
                    </div>
                )}
                {reservation?.group && (
                    <div className={styles.group}>
                        {reservation.group}
                    </div>
                )}
                <div className={styles.footer} style={{ background: footerColor }}>
                    <div className={`${styles.tableNumber} ${id.length > 2 ? styles.tableNumberLong : styles.tableNumberShort}`}>
                        {id}
                    </div>
                </div>
            </div>
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 23, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 98, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
        </div>
    );

    const render1x2 = () => (
        <div
            data-테이블={type}
            className={`${styles.tableContainer} ${styles.table1x2}`}
            style={{ width, height, left: position.left, top: position.top, cursor: status === 'empty' ? 'default' : 'pointer' }}
            onClick={handleTableClick}
        >
            <div className={styles.innerContent}>
                <div className={styles.time}>
                    {reservation?.time || '00:00'}
                </div>
                {reservation?.name && (
                    <div className={styles.name}>
                        {reservation.name}
                    </div>
                )}
                {reservation?.group && (
                    <div className={styles.group}>
                        {reservation.group}
                    </div>
                )}
                <div className={styles.footer} style={{ background: footerColor }}>
                    <div className={styles.tableNumber}>{id}</div>
                </div>
            </div>
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108, background: borderColor }} />
        </div>
    );

    const render1x3 = () => (
        <div
            data-테이블={type}
            className={`${styles.tableContainer} ${styles.table1x3}`}
            style={{ width, height, left: position.left, top: position.top, cursor: status === 'empty' ? 'default' : 'pointer' }}
            onClick={handleTableClick}
        >
            <div className={styles.innerContent}>
                <div className={styles.time}>
                    {reservation?.time || '00:00'}
                </div>
                {reservation?.name && (
                    <div className={styles.name}>
                        {reservation.name}
                    </div>
                )}
                {reservation?.group && (
                    <div className={styles.group}>
                        {reservation.group}
                    </div>
                )}
                <div className={styles.footer} style={{ background: footerColor }}>
                    <div className={styles.tableNumber}>{id}</div>
                </div>
            </div>
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 270, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 194, background: borderColor }} />
        </div>
    );

    const render1x4 = () => (
        <div
            data-테이블={type}
            className={`${styles.tableContainer} ${styles.table1x4}`}
            style={{ width, height, left: position.left, top: position.top, cursor: status === 'empty' ? 'default' : 'pointer' }}
            onClick={handleTableClick}
        >
            <div className={styles.innerContent}>
                <div className={styles.time}>
                    {reservation?.time || '00:00'}
                </div>
                <div className={styles.footer} style={{ background: footerColor }}>
                    <div className={styles.tableNumber}>{id}</div>
                </div>
            </div>
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 269, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 358, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 194, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 283, background: borderColor }} />
        </div>
    );

    const render4x1 = () => (
        <div
            data-테이블={type}
            className={`${styles.tableContainer} ${styles.table4x1}`}
            style={{ width, height, left: position.left, top: position.top, cursor: status === 'empty' ? 'default' : 'pointer' }}
            onClick={handleTableClick}
        >
            <div className={styles.innerContent}>
                <div className={styles.time}>
                    {reservation?.time || '00:00'}
                </div>
                {reservation?.name && (
                    <div className={styles.name}>
                        {reservation.name}
                    </div>
                )}
                {reservation?.group && (
                    <div className={styles.group}>
                        {reservation.group}
                    </div>
                )}
                <div className={styles.footer} style={{ background: footerColor }}>
                    <div className={styles.tableNumber}>
                        {id}
                    </div>
                </div>
            </div>
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 194, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 281, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 108, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 269, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 357, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 98, top: height, background: borderColor }} />
        </div>
    );

    const render1x5 = () => (
        <div
            data-테이블={type}
            className={`${styles.tableContainer} ${styles.table1x5}`}
            style={{ width, height, left: position.left, top: position.top, cursor: status === 'empty' ? 'default' : 'pointer' }}
            onClick={handleTableClick}
        >
            <div className={styles.innerContent}>
                <div className={styles.time}>
                    {reservation?.time || '00:00'}
                </div>
                <div className={styles.footer} style={{ background: footerColor }}>
                    <div className={styles.tableNumber}>{id}</div>
                </div>
            </div>
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 269, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 358, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 445, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 194, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 283, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 370, background: borderColor }} />
        </div>
    );

    const render2x1 = () => (
        <div
            data-테이블={type}
            className={`${styles.tableContainer} ${styles.table2x1}`}
            style={{ width, height, left: position.left, top: position.top, cursor: status === 'empty' ? 'default' : 'pointer' }}
            onClick={handleTableClick}
        >
            <div className={styles.innerContent}>
                <div className={styles.time}>
                    {reservation?.time || '00:00'}
                </div>
                {reservation?.name && (
                    <div className={styles.name}>
                        {reservation.name}
                    </div>
                )}
                {reservation?.group && (
                    <div className={styles.group}>
                        {reservation.group}
                    </div>
                )}
                <div className={styles.footer} style={{ background: footerColor }}>
                    <div className={styles.tableNumber}>{id}</div>
                </div>
            </div>
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 108, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
        </div>
    );

    const render2x2 = () => (
        <div
            data-테이블={type}
            className={`${styles.tableContainer} ${styles.table2x2}`}
            style={{ width, height, left: position.left, top: position.top, cursor: status === 'empty' ? 'default' : 'pointer' }}
            onClick={handleTableClick}
        >
            <div className={styles.innerContent}>
                <div className={styles.time}>
                    {reservation?.time || '00:00'}
                </div>
                {reservation?.name && (
                    <div className={styles.name}>
                        {reservation.name}
                    </div>
                )}
                {reservation?.group && (
                    <div className={styles.group}>
                        {reservation.group}
                    </div>
                )}
                <div className={styles.footer} style={{ background: footerColor }}>
                    <div className={styles.tableNumber}>{id}</div>
                </div>
            </div>
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 108, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 184, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 108, background: borderColor }} />
        </div>
    );

    const render3x1 = () => (
        <div
            data-테이블={type}
            className={`${styles.tableContainer} ${styles.table3x1}`}
            style={{ width, height, left: position.left, top: position.top, cursor: status === 'empty' ? 'default' : 'pointer' }}
            onClick={handleTableClick}
        >
            <div className={styles.innerContent}>
                <div className={styles.time}>
                    {reservation?.time || '00:00'}
                </div>
                {reservation?.name && (
                    <div className={styles.name}>
                        {reservation.name}
                    </div>
                )}
                {reservation?.group && (
                    <div className={styles.group}>
                        {reservation.group}
                    </div>
                )}
                <div className={styles.footer} style={{ background: footerColor }}>
                    <div className={styles.tableNumber}>{id}</div>
                </div>
            </div>
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 108, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 194, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 97, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 269, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
        </div>
    );

    const render5x1 = () => (
        <div
            data-테이블={type}
            className={`${styles.tableContainer} ${styles.table5x1}`}
            style={{ width, height, left: position.left, top: position.top, cursor: status === 'empty' ? 'default' : 'pointer' }}
            onClick={handleTableClick}
        >
            <div className={styles.innerContent}>
                <div className={styles.time}>
                    {reservation?.time || '00:00'}
                </div>
                {reservation?.name && (
                    <div className={styles.name}>
                        {reservation.name}
                    </div>
                )}
                {reservation?.group && (
                    <div className={styles.group}>
                        {reservation.group}
                    </div>
                )}
                <div className={styles.footer} style={{ background: footerColor }}>
                    <div className={styles.tableNumber}>
                        {id}
                    </div>
                </div>
            </div>
            <div className={`${styles.border} ${styles.borderRight}`} style={{ left: width, top: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderLeft}`} style={{ left: 0, top: 98, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 22, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 108, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 194, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 281, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderTop}`} style={{ left: 367, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 98, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 183, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 269, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 357, top: height, background: borderColor }} />
            <div className={`${styles.border} ${styles.borderBottom}`} style={{ left: 443, top: height, background: borderColor }} />
        </div>
    );

    switch (type) {
        case '1x1':
            return render1x1();
        case '1x2':
            return render1x2();
        case '1x3':
            return render1x3();
        case '1x4':
            return render1x4();
        case '1x5':
            return render1x5();
        case '2x1':
            return render2x1();
        case '2x2':
            return render2x2();
        case '3x1':
            return render3x1();
        case '4x1':
            return render4x1();
        case '5x1':
            return render5x1();
        default:
            return null;
    }
};

export default TableItem;

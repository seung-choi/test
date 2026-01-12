'use client';

import React from 'react';
import styles from '@/styles/components/admin/drawer/canvas/tableSelector.module.scss';
import { TableType, DragData } from '@/types';
import TableShape from '@/components/common/TableShape';

const TableSelector: React.FC = () => {
    const handleDragStart = (e: React.DragEvent, type: TableType) => {
        const dragData: DragData = {
            type,
            isNew: true
        };
        e.dataTransfer.setData('application/json', JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const borderColor = '#7B7B7B';

    const tableConfigs: { type: TableType; capacity: string }[] = [
        { type: 'T4S', capacity: '4인' },
        { type: 'T6R', capacity: '6인' },
        { type: 'T8S', capacity: '8인' },
        { type: 'T8R', capacity: '8인' },
        { type: 'T10R', capacity: '10인' },
        { type: 'T12R', capacity: '12인' }
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>테이블 선택</h2>
            <div className={styles.tableGrid}>
                <div className={styles.row}>
                    {tableConfigs.slice(0, 2).map(({ type, capacity }) => (
                        <div
                            key={type}
                            className={styles.tableContainer}
                            draggable
                            onDragStart={(e) => handleDragStart(e, type)}
                        >
                            <TableShape type={type} borderColor={borderColor}>
                                <div className={styles.capacity}>{capacity}</div>
                            </TableShape>
                        </div>
                    ))}
                </div>
                {tableConfigs.slice(2).map(({ type, capacity }) => (
                    <div key={type} className={styles.row}>
                        <div
                            className={styles.tableContainer}
                            draggable
                            onDragStart={(e) => handleDragStart(e, type)}
                        >
                            <TableShape type={type} borderColor={borderColor}>
                                <div className={styles.capacity}>{capacity}</div>
                            </TableShape>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableSelector;

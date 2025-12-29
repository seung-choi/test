'use client';

import React from 'react';
import styles from '@/styles/components/admin/drawer/canvas/tableListView.module.scss';
import { PlacedTable } from '@/types/admin/layout.type';

interface TableListViewProps {
    placedTables: PlacedTable[];
    onTableClick?: (table: PlacedTable) => void;
}

const TableListView: React.FC<TableListViewProps> = ({ placedTables, onTableClick }) => {
    return (
        <div className={styles.listContainer}>
            {placedTables.map((table) => (
                <div
                    key={table.id}
                    className={`${styles.tableCard} ${table.tableNumber ? styles.assigned : styles.unassigned}`}
                    onClick={() => onTableClick?.(table)}
                    style={{ cursor: onTableClick ? 'pointer' : 'default' }}
                >
                    <div className={styles.tableType}>{table.type}</div>

                    {table.tableNumber && (
                        <div className={styles.tableInfo}>
                            <div className={styles.assignedLabel}>번호 지정됨</div>
                        </div>
                    )}

                    <div className={styles.tableTab}>
                        <div className={styles.tableNumber}>
                            {table.tableNumber ? `${table.tableNumber}번` : '미지정'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TableListView;
